namespace PaymentServiceAPI.Models;

public record PaymentRequest(
    decimal Amount,
    string Description,
    string Currency = "USD"
);

public record PaymentResponse(
    Guid PaymentId,
    decimal Amount,
    string Description,
    string Status,
    string ProcessedBy,
    DateTime ProcessedAt
);

public record EncryptedPayload(
    string EncryptedData,
    string EncryptedKey,
    string InitializationVector
);
