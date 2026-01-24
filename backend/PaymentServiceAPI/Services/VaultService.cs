using System.Text;
using System.Text.Json;

namespace PaymentServiceAPI.Services;

/// <summary>
/// Implementación del servicio de Vault para Sistema B
/// Se enfoca en desencriptación de datos recibidos desde Sistema A
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

        _logger.LogInformation("[Payment Service] VaultService initialized");
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
                _logger.LogError("[Payment Service] Vault decryption failed: {Error}", error);
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

            _logger.LogInformation("[Payment Service] Data decrypted successfully");
            return plaintext;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[Payment Service] Error decrypting data");
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
            _logger.LogError(ex, "[Payment Service] Vault health check failed");
            return false;
        }
    }
}
