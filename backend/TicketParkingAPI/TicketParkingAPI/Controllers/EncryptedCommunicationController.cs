using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketParkingAPI.Services;

namespace TicketParkingAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EncryptedCommunicationController : ControllerBase
{
    private readonly IPaymentServiceClient _paymentServiceClient;
    private readonly IVaultService _vaultService;
    private readonly ILogger<EncryptedCommunicationController> _logger;

    public EncryptedCommunicationController(
        IPaymentServiceClient paymentServiceClient,
        IVaultService vaultService,
        ILogger<EncryptedCommunicationController> logger)
    {
        _paymentServiceClient = paymentServiceClient;
        _vaultService = vaultService;
        _logger = logger;
    }

    /// <summary>
    /// Endpoint de prueba para enviar un pago encriptado al Sistema B
    /// </summary>
    [HttpPost("test-encrypted-payment")]
    [Authorize(Roles = "admin,operator")]
    public async Task<IActionResult> TestEncryptedPayment([FromBody] TestPaymentRequest request)
    {
        try
        {
            _logger.LogInformation(
                "Testing encrypted payment: Amount={Amount}, Description={Description}",
                request.Amount,
                request.Description
            );

            // Verificar que Vault esté disponible
            var isVaultHealthy = await _vaultService.IsHealthyAsync();
            if (!isVaultHealthy)
            {
                return StatusCode(503, new
                {
                    success = false,
                    message = "Vault KMS is not available"
                });
            }

            // Verificar que Payment Service esté disponible
            var isPaymentServiceHealthy = await _paymentServiceClient.IsHealthyAsync();
            if (!isPaymentServiceHealthy)
            {
                return StatusCode(503, new
                {
                    success = false,
                    message = "Payment Service is not available"
                });
            }

            // Enviar pago encriptado
            var result = await _paymentServiceClient.ProcessEncryptedPaymentAsync(
                request.Amount,
                request.Description,
                request.Currency ?? "USD"
            );

            if (!result.Success)
            {
                return BadRequest(new
                {
                    success = false,
                    message = result.Message
                });
            }

            return Ok(new
            {
                success = true,
                message = "Encrypted payment sent and processed successfully",
                data = result.Data,
                flow = new
                {
                    step1 = "Sistema A: Datos encriptados con Vault",
                    step2 = "Sistema A: Enviados a Sistema B vía HTTP",
                    step3 = "Sistema B: Recibidos y desencriptados con Vault",
                    step4 = "Sistema B: Pago procesado exitosamente"
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing encrypted payment");
            return StatusCode(500, new
            {
                success = false,
                message = "Error testing encrypted payment",
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// Endpoint para verificar el estado de Vault
    /// </summary>
    [HttpGet("vault/health")]
    [AllowAnonymous]
    public async Task<IActionResult> GetVaultHealth()
    {
        try
        {
            var isHealthy = await _vaultService.IsHealthyAsync();
            return Ok(new
            {
                service = "HashiCorp Vault",
                status = isHealthy ? "healthy" : "unhealthy",
                address = "http://localhost:8200",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                service = "HashiCorp Vault",
                status = "error",
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// Endpoint para verificar el estado del Payment Service
    /// </summary>
    [HttpGet("payment-service/health")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPaymentServiceHealth()
    {
        try
        {
            var isHealthy = await _paymentServiceClient.IsHealthyAsync();
            return Ok(new
            {
                service = "Payment Service (Sistema B)",
                status = isHealthy ? "healthy" : "unhealthy",
                address = "http://localhost:5001",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                service = "Payment Service (Sistema B)",
                status = "error",
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// Endpoint de demostración del flujo completo de encriptación
    /// </summary>
    [HttpPost("demo-encryption-flow")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DemoEncryptionFlow([FromBody] DemoRequest request)
    {
        try
        {
            var steps = new List<object>();

            // Paso 1: Encriptar datos
            steps.Add(new
            {
                step = 1,
                action = "Encrypting data with Vault",
                input = request.PlainText
            });

            var encrypted = await _vaultService.EncryptAsync(request.PlainText);

            steps.Add(new
            {
                step = 2,
                action = "Data encrypted",
                output = encrypted
            });

            // Paso 2: Desencriptar datos
            steps.Add(new
            {
                step = 3,
                action = "Decrypting data with Vault"
            });

            var decrypted = await _vaultService.DecryptAsync(encrypted);

            steps.Add(new
            {
                step = 4,
                action = "Data decrypted",
                output = decrypted,
                matches = decrypted == request.PlainText
            });

            return Ok(new
            {
                success = true,
                message = "Encryption/Decryption flow completed successfully",
                steps = steps,
                summary = new
                {
                    originalText = request.PlainText,
                    encryptedText = encrypted,
                    decryptedText = decrypted,
                    integrity = decrypted == request.PlainText ? "VERIFIED" : "FAILED"
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in demo encryption flow");
            return StatusCode(500, new
            {
                success = false,
                message = "Error in encryption flow",
                error = ex.Message
            });
        }
    }
}

public record TestPaymentRequest(
    decimal Amount,
    string Description,
    string? Currency = "USD"
);

public record DemoRequest(
    string PlainText
);
