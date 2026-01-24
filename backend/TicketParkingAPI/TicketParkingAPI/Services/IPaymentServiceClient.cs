namespace TicketParkingAPI.Services;

/// <summary>
/// Interfaz para el servicio de comunicación con el Sistema B (Payment Service)
/// </summary>
public interface IPaymentServiceClient
{
    /// <summary>
    /// Envía una solicitud de pago encriptada al Sistema B
    /// </summary>
    /// <param name="amount">Monto del pago</param>
    /// <param name="description">Descripción del pago</param>
    /// <param name="currency">Moneda (USD por defecto)</param>
    /// <returns>Respuesta del servicio de pagos</returns>
    Task<PaymentServiceResponse> ProcessEncryptedPaymentAsync(
        decimal amount, 
        string description, 
        string currency = "USD"
    );

    /// <summary>
    /// Verifica la salud del Sistema B
    /// </summary>
    /// <returns>True si el servicio está disponible</returns>
    Task<bool> IsHealthyAsync();
}

/// <summary>
/// Respuesta del servicio de pagos
/// </summary>
public record PaymentServiceResponse(
    bool Success,
    string Message,
    object? Data = null
);
