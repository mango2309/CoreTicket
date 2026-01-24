using System.Text;
using System.Text.Json;

namespace TicketParkingAPI.Services;

/// <summary>
/// Implementación del servicio de HashiCorp Vault
/// Utiliza el Transit Engine para encriptación/desencriptación
/// </summary>
public class VaultService : IVaultService
{
    private readonly HttpClient _httpClient;
    private readonly string _vaultAddress;
    private readonly string _vaultToken;
    private readonly string _transitKeyName;
    private readonly ILogger<VaultService> _logger;

    public VaultService(IConfiguration configuration, ILogger<VaultService> logger)
    {
        _logger = logger;
        _vaultAddress = configuration["Vault:Address"] ?? "http://localhost:8200";
        _vaultToken = configuration["Vault:Token"] ?? "root-token";
        _transitKeyName = configuration["Vault:TransitKeyName"] ?? "coreticket-key";

        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(_vaultAddress)
        };
        _httpClient.DefaultRequestHeaders.Add("X-Vault-Token", _vaultToken);

        _logger.LogInformation("VaultService initialized. Address: {Address}, Key: {Key}", 
            _vaultAddress, _transitKeyName);
    }

    public async Task<string> EncryptAsync(string plaintext)
    {
        try
        {
            var base64Plaintext = Convert.ToBase64String(Encoding.UTF8.GetBytes(plaintext));
            
            var requestBody = new
            {
                plaintext = base64Plaintext
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(
                $"/v1/transit/encrypt/{_transitKeyName}",
                content
            );

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError("Vault encryption failed: {Error}", error);
                throw new Exception($"Vault encryption failed: {error}");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var jsonDoc = JsonDocument.Parse(responseContent);
            var ciphertext = jsonDoc.RootElement.GetProperty("data").GetProperty("ciphertext").GetString();

            _logger.LogInformation("Data encrypted successfully");
            return ciphertext ?? throw new Exception("Ciphertext is null");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error encrypting data");
            throw;
        }
    }

    public async Task<string> DecryptAsync(string ciphertext)
    {
        try
        {
            var requestBody = new
            {
                ciphertext = ciphertext
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(
                $"/v1/transit/decrypt/{_transitKeyName}",
                content
            );

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError("Vault decryption failed: {Error}", error);
                throw new Exception($"Vault decryption failed: {error}");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var jsonDoc = JsonDocument.Parse(responseContent);
            var base64Plaintext = jsonDoc.RootElement.GetProperty("data").GetProperty("plaintext").GetString();

            if (string.IsNullOrEmpty(base64Plaintext))
            {
                throw new Exception("Plaintext is null or empty");
            }

            var plaintext = Encoding.UTF8.GetString(Convert.FromBase64String(base64Plaintext));

            _logger.LogInformation("Data decrypted successfully");
            return plaintext;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error decrypting data");
            throw;
        }
    }

    public async Task<bool> IsHealthyAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("/v1/sys/health");
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Vault health check failed");
            return false;
        }
    }

    public async Task<string> GetSecretAsync(string path)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/v1/secret/data/{path}");

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to get secret from Vault: {Error}", error);
                throw new Exception($"Failed to get secret: {error}");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var jsonDoc = JsonDocument.Parse(responseContent);
            var secretValue = jsonDoc.RootElement
                .GetProperty("data")
                .GetProperty("data")
                .GetProperty("value")
                .GetString();

            return secretValue ?? throw new Exception("Secret value is null");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting secret from Vault");
            throw;
        }
    }
}
