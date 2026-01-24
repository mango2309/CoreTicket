using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PaymentServiceAPI.Models;
using System.Security.Claims;

namespace PaymentServiceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // 🔒 Requiere autenticación
public class PaymentController : ControllerBase
{
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(ILogger<PaymentController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Procesar un pago (requiere rol admin u operator)
    /// </summary>
    [HttpPost("process")]
    [Authorize(Roles = "admin,operator")]
    public IActionResult ProcessPayment([FromBody] PaymentRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                     ?? User.FindFirst("sub")?.Value 
                     ?? "unknown";
        var username = User.Identity?.Name ?? "unknown";
        
        _logger.LogInformation(
            "Processing payment of {Amount} {Currency} for user {UserId}", 
            request.Amount, 
            request.Currency, 
            userId
        );

        var response = new PaymentResponse(
            PaymentId: Guid.NewGuid(),
            Amount: request.Amount,
            Description: request.Description,
            Status: "completed",
            ProcessedBy: username,
            ProcessedAt: DateTime.UtcNow
        );

        return Ok(response);
    }

    /// <summary>
    /// Obtener información de un pago (todos los roles autenticados)
    /// </summary>
    [HttpGet("{id:guid}")]
    public IActionResult GetPayment(Guid id)
    {
        var userId = User.FindFirst("sub")?.Value ?? "unknown";
        
        _logger.LogInformation("User {UserId} retrieving payment {PaymentId}", userId, id);

        var response = new PaymentResponse(
            PaymentId: id,
            Amount: 100.00m,
            Description: "Sample payment",
            Status: "completed",
            ProcessedBy: userId,
            ProcessedAt: DateTime.UtcNow.AddHours(-1)
        );

        return Ok(response);
    }

    /// <summary>
    /// Endpoint para recibir datos encriptados desde Sistema A
    /// Desencripta usando HashiCorp Vault KMS
    /// </summary>
    [HttpPost("process-encrypted")]
    [Authorize(Roles = "admin,operator")]
    public async Task<IActionResult> ProcessEncryptedPayment(
        [FromBody] EncryptedPayload payload,
        [FromServices] Services.IVaultService vaultService)
    {
        try
        {
            var userId = User.FindFirst("sub")?.Value ?? "unknown";
            _logger.LogInformation(
                "[Payment Service] Received encrypted payment from user {UserId}",
                userId
            );

            // 1. Verificar que Vault esté disponible
            var isVaultHealthy = await vaultService.IsHealthyAsync();
            if (!isVaultHealthy)
            {
                _logger.LogError("[Payment Service] Vault is not healthy");
                return StatusCode(503, new
                {
                    success = false,
                    message = "KMS service unavailable"
                });
            }

            // 2. Desencriptar el payload usando Vault
            _logger.LogInformation("[Payment Service] Decrypting payment data with Vault...");
            var decryptedJson = await vaultService.DecryptAsync(payload.EncryptedData);

            // 3. Parsear los datos desencriptados
            var paymentData = System.Text.Json.JsonSerializer.Deserialize<PaymentData>(decryptedJson);

            if (paymentData == null)
            {
                _logger.LogError("[Payment Service] Failed to parse decrypted payment data");
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid payment data format"
                });
            }

            _logger.LogInformation(
                "[Payment Service] Payment decrypted successfully: Amount={Amount}, Description={Description}",
                paymentData.Amount,
                paymentData.Description
            );

            // 4. Procesar el pago (lógica de negocio)
            var paymentResponse = new PaymentResponse(
                PaymentId: Guid.NewGuid(),
                Amount: paymentData.Amount,
                Description: paymentData.Description,
                Status: "completed",
                ProcessedBy: userId,
                ProcessedAt: DateTime.UtcNow
            );

            _logger.LogInformation(
                "[Payment Service] Payment processed successfully: PaymentId={PaymentId}",
                paymentResponse.PaymentId
            );

            // 5. Retornar respuesta
            return Ok(new
            {
                success = true,
                message = "Encrypted payment processed successfully",
                data = paymentResponse,
                encryption = new
                {
                    method = "HashiCorp Vault Transit Engine",
                    keyReference = payload.EncryptedKey,
                    decryptedAt = DateTime.UtcNow
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[Payment Service] Error processing encrypted payment");
            return StatusCode(500, new
            {
                success = false,
                message = "Error processing encrypted payment",
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// Health check endpoint (no requiere autenticación)
    /// </summary>
    [HttpGet("health")]
    [AllowAnonymous]
    public IActionResult Health()
    {
        return Ok(new 
        { 
            status = "healthy",
            service = "Payment Service API",
            timestamp = DateTime.UtcNow
        });
    }
}
