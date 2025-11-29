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
    /// Endpoint para recibir datos encriptados (para Sprint 4)
    /// </summary>
    [HttpPost("process-encrypted")]
    [Authorize(Roles = "admin,operator")]
    public IActionResult ProcessEncryptedPayment([FromBody] EncryptedPayload payload)
    {
        _logger.LogInformation("Received encrypted payment payload");

        // TODO: En Sprint 4 se implementará la desencriptación con KMS
        return Ok(new 
        { 
            message = "Encrypted payload received (decryption pending Sprint 4)",
            payloadReceived = true
        });
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
