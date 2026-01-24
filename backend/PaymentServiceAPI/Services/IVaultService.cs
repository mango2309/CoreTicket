namespace PaymentServiceAPI.Services;

/// <summary>
/// Interfaz para el servicio de HashiCorp Vault en el Sistema B
/// </summary>
public interface IVaultService
{
    Task<string> DecryptAsync(string ciphertext);
    Task<bool> IsHealthyAsync();
}
