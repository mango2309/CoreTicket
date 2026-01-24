using System.Text;
using System.Text.Json;

namespace TicketParkingAPI.Services;

/// <summary>
/// Cliente para comunicación encriptada con el Sistema B (Payment Service)
/// Utiliza Vault para encriptar datos antes de enviarlos
/// </summary>
public class PaymentServiceClient : IPaymentServiceClient
{
    private readonly HttpClient _httpClient;
    private readonly IVaultService _vaultService;
    private readonly ILogger<PaymentServiceClient> _logger;
    private readonly string _paymentServiceUrl;

    public PaymentServiceClient(
        HttpClient httpClient,
        IVaultService vaultService,
        IConfiguration configuration,
        ILogger<PaymentServiceClient> logger)
    {
        _httpClient = httpClient;
        _vaultService = vaultService;
        _logger = logger;
        _paymentServiceUrl = configuration["PaymentService:Url"] ?? "http://localhost:5001";

        _httpClient.BaseAddress = new Uri(_paymentServiceUrl);
    }

    public async Task<PaymentServiceResponse> ProcessEncryptedPaymentAsync(
        decimal amount,
        string description,
        string currency = "USD")
    {
        try
        {
            _logger.LogInformation(
                "Processing encrypted payment: Amount={Amount}, Description={Description}",
                amount, description
            );

            // 1. Crear el payload con los datos del pago
            var paymentData = new
            {
                amount = amount,
                description = description,
                currency = currency,
                timestamp = DateTime.UtcNow,
                source = "Sistema A - CoreTicket"
            };

            var jsonPayload = JsonSerializer.Serialize(paymentData);

            // 2. Encriptar el payload usando Vault
            _logger.LogInformation("Encrypting payment data with Vault...");
            var encryptedData = await _vaultService.EncryptAsync(jsonPayload);

            // 3. Crear el payload encriptado para enviar
            var encryptedPayload = new
            {
                encryptedData = encryptedData,
                encryptedKey = "vault:v1:coreticket-key", // Referencia a la clave en Vault
                initializationVector = "N/A" // Vault maneja esto internamente
            };

            var content = new StringContent(
                JsonSerializer.Serialize(encryptedPayload),
                Encoding.UTF8,
                "application/json"
            );

            // 4. Obtener token JWT para autenticación
            // Nota: En producción, esto debería venir del contexto del usuario actual
            var token = await GetCurrentUserTokenAsync();
            if (!string.IsNullOrEmpty(token))
            {
                _httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            }

            // 5. Enviar la solicitud encriptada al Sistema B
            _logger.LogInformation("Sending encrypted payment to Payment Service...");
            var response = await _httpClient.PostAsync("/api/payment/process-encrypted", content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError("Payment Service returned error: {Error}", error);
                return new PaymentServiceResponse(
                    Success: false,
                    Message: $"Payment Service error: {error}"
                );
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var responseData = JsonSerializer.Deserialize<JsonElement>(responseContent);

            _logger.LogInformation("Payment processed successfully");
            return new PaymentServiceResponse(
                Success: true,
                Message: "Payment processed successfully",
                Data: responseData
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing encrypted payment");
            return new PaymentServiceResponse(
                Success: false,
                Message: $"Error: {ex.Message}"
            );
        }
    }

    public async Task<bool> IsHealthyAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("/api/payment/health");
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Payment Service health check failed");
            return false;
        }
    }

    /// <summary>
    /// Obtiene el token JWT del usuario actual
    /// En producción, esto debería venir del HttpContext
    /// </summary>
    private async Task<string> GetCurrentUserTokenAsync()
    {
        // TODO: Implementar obtención del token del contexto HTTP actual
        // Por ahora retorna vacío para testing
        await Task.CompletedTask;
        return string.Empty;
    }
}
