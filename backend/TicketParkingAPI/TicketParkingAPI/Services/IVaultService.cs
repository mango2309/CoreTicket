namespace TicketParkingAPI.Services;

/// <summary>
/// Interfaz para el servicio de HashiCorp Vault (KMS)
/// Proporciona funcionalidades de encriptación y desencriptación
/// </summary>
public interface IVaultService
{
    /// <summary>
    /// Encripta datos usando Vault Transit Engine
    /// </summary>
    /// <param name="plaintext">Texto plano a encriptar</param>
    /// <returns>Texto encriptado en formato base64</returns>
    Task<string> EncryptAsync(string plaintext);

    /// <summary>
    /// Desencripta datos usando Vault Transit Engine
    /// </summary>
    /// <param name="ciphertext">Texto encriptado</param>
    /// <returns>Texto plano desencriptado</returns>
    Task<string> DecryptAsync(string ciphertext);

    /// <summary>
    /// Verifica la salud de la conexión con Vault
    /// </summary>
    /// <returns>True si Vault está disponible</returns>
    Task<bool> IsHealthyAsync();

    /// <summary>
    /// Obtiene un secreto de Vault
    /// </summary>
    /// <param name="path">Ruta del secreto</param>
    /// <returns>Valor del secreto</returns>
    Task<string> GetSecretAsync(string path);
}
