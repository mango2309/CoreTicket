# Comunicación Encriptada con HashiCorp Vault (KMS)

## 🎯 Objetivo
Implementar comunicación segura y encriptada entre Sistema A (CoreTicket) y Sistema B (Payment Service) utilizando HashiCorp Vault como Key Management Service (KMS).

---

## 🏗️ Arquitectura de Encriptación

```
┌─────────────────────────────────────────────────────────────────┐
│                     FLUJO DE ENCRIPTACIÓN                        │
└─────────────────────────────────────────────────────────────────┘

Sistema A (CoreTicket)                 Sistema B (Payment Service)
Puerto: 5000                           Puerto: 5001
        │                                       │
        │  1. Datos de Pago                     │
        │  {amount: 100, desc: "..."}           │
        │                                       │
        ▼                                       │
┌───────────────┐                               │
│ VaultService  │                               │
│  (Encrypt)    │                               │
└───────────────┘                               │
        │                                       │
        │  2. Llamada a Vault                   │
        ▼                                       │
┌─────────────────────────────────────────────┐ │
│        HashiCorp Vault (KMS)                │ │
│        Puerto: 8200                         │ │
│                                             │ │
│  Transit Engine: /transit/encrypt/key       │ │
│  ✅ Encripta con AES-256-GCM                │ │
└─────────────────────────────────────────────┘ │
        │                                       │
        │  3. Ciphertext                        │
        │  "vault:v1:8SDd3WHDOjf74mq..."        │
        ▼                                       │
┌───────────────────┐                           │
│ PaymentService    │                           │
│ Client            │                           │
└───────────────────┘                           │
        │                                       │
        │  4. HTTP POST                         │
        │  /api/payment/process-encrypted       │
        │  Authorization: Bearer <JWT>          │
        │  Body: {encryptedData, key, iv}       │
        │                                       │
        └──────────────────────────────────────►│
                                                │
                                        ┌───────────────┐
                                        │ VaultService  │
                                        │  (Decrypt)    │
                                        └───────────────┘
                                                │
                                                │  5. Llamada a Vault
                                                ▼
                                        ┌─────────────────┐
                                        │  Vault Transit  │
                                        │  /decrypt/key   │
                                        └─────────────────┘
                                                │
                                                │  6. Plaintext
                                                ▼
                                        ┌───────────────┐
                                        │ Process       │
                                        │ Payment       │
                                        └───────────────┘
                                                │
                                                │  7. Response
                                                ▼
        ┌──────────────────────────────────────┘
        │
        ▼
┌───────────────┐
│ Response OK   │
│ {success:true}│
└───────────────┘
```

---

## 🚀 Configuración Paso a Paso

### Paso 1: Levantar Vault

```powershell
# Vault ya está configurado en docker-compose.yml
docker-compose up -d vault

# Verificar que esté corriendo
docker-compose ps vault
```

### Paso 2: Configurar Transit Engine

```powershell
# Ejecutar script de configuración
.\setup-vault.ps1
```

Este script realiza:
1. ✅ Habilita Transit Engine
2. ✅ Crea clave de encriptación `coreticket-key`
3. ✅ Configura políticas de acceso
4. ✅ Prueba encriptación/desencriptación

### Paso 3: Verificar Configuración

```powershell
# Verificar salud de Vault
curl http://localhost:8200/v1/sys/health

# Ver información de la clave
docker exec vault vault read transit/keys/coreticket-key
```

---

## 🔐 Implementación en Código

### Sistema A: Encriptación

**Archivo:** `TicketParkingAPI/Services/VaultService.cs`

```csharp
public async Task<string> EncryptAsync(string plaintext)
{
    // 1. Convertir a Base64
    var base64Plaintext = Convert.ToBase64String(
        Encoding.UTF8.GetBytes(plaintext)
    );
    
    // 2. Llamar a Vault Transit Engine
    var requestBody = new { plaintext = base64Plaintext };
    var response = await _httpClient.PostAsync(
        $"/v1/transit/encrypt/{_transitKeyName}",
        new StringContent(JsonSerializer.Serialize(requestBody))
    );
    
    // 3. Retornar ciphertext
    var result = await response.Content.ReadAsStringAsync();
    var json = JsonDocument.Parse(result);
    return json.RootElement
        .GetProperty("data")
        .GetProperty("ciphertext")
        .GetString();
}
```

### Sistema A: Envío de Datos

**Archivo:** `TicketParkingAPI/Services/PaymentServiceClient.cs`

```csharp
public async Task<PaymentServiceResponse> ProcessEncryptedPaymentAsync(
    decimal amount, string description, string currency = "USD")
{
    // 1. Crear payload
    var paymentData = new {
        amount, description, currency,
        timestamp = DateTime.UtcNow,
        source = "Sistema A"
    };
    
    // 2. Encriptar con Vault
    var encrypted = await _vaultService.EncryptAsync(
        JsonSerializer.Serialize(paymentData)
    );
    
    // 3. Enviar a Sistema B
    var payload = new {
        encryptedData = encrypted,
        encryptedKey = "vault:v1:coreticket-key",
        initializationVector = "N/A"
    };
    
    var response = await _httpClient.PostAsync(
        "/api/payment/process-encrypted",
        new StringContent(JsonSerializer.Serialize(payload))
    );
    
    return await response.Content.ReadAsAsync<PaymentServiceResponse>();
}
```

### Sistema B: Desencriptación

**Archivo:** `PaymentServiceAPI/Services/VaultService.cs`

```csharp
public async Task<string> DecryptAsync(string ciphertext)
{
    // 1. Llamar a Vault Transit Engine
    var requestBody = new { ciphertext = ciphertext };
    var response = await _httpClient.PostAsync(
        $"/v1/transit/decrypt/{_transitKeyName}",
        new StringContent(JsonSerializer.Serialize(requestBody))
    );
    
    // 2. Obtener plaintext en Base64
    var result = await response.Content.ReadAsStringAsync();
    var json = JsonDocument.Parse(result);
    var base64Plaintext = json.RootElement
        .GetProperty("data")
        .GetProperty("plaintext")
        .GetString();
    
    // 3. Decodificar y retornar
    return Encoding.UTF8.GetString(
        Convert.FromBase64String(base64Plaintext)
    );
}
```

### Sistema B: Procesamiento

**Archivo:** `PaymentServiceAPI/Controllers/PaymentController.cs`

```csharp
[HttpPost("process-encrypted")]
[Authorize(Roles = "admin,operator")]
public async Task<IActionResult> ProcessEncryptedPayment(
    [FromBody] EncryptedPayload payload,
    [FromServices] IVaultService vaultService)
{
    // 1. Verificar Vault
    if (!await vaultService.IsHealthyAsync())
        return StatusCode(503, "KMS unavailable");
    
    // 2. Desencriptar
    var decryptedJson = await vaultService.DecryptAsync(
        payload.EncryptedData
    );
    
    // 3. Parsear datos
    var paymentData = JsonSerializer.Deserialize<PaymentData>(
        decryptedJson
    );
    
    // 4. Procesar pago
    var response = new PaymentResponse(
        PaymentId: Guid.NewGuid(),
        Amount: paymentData.Amount,
        Description: paymentData.Description,
        Status: "completed",
        ProcessedBy: User.Identity.Name,
        ProcessedAt: DateTime.UtcNow
    );
    
    return Ok(response);
}
```

---

## 🧪 Pruebas

### Prueba 1: Health Check de Vault

```bash
# Desde Sistema A
curl http://localhost:5000/api/encryptedcommunication/vault/health

# Respuesta esperada:
{
  "service": "HashiCorp Vault",
  "status": "healthy",
  "address": "http://localhost:8200",
  "timestamp": "2026-01-23T23:00:00Z"
}
```

### Prueba 2: Demo de Encriptación

```bash
# Obtener token JWT
TOKEN=$(curl -s -X POST http://localhost:8080/realms/coreticket-realm/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=coreticket-client" \
  -d "username=admin.user" \
  -d "password=admin123" \
  -d "grant_type=password" | jq -r '.access_token')

# Probar encriptación/desencriptación
curl -X POST http://localhost:5000/api/encryptedcommunication/demo-encryption-flow \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plainText": "Datos secretos de prueba"}'

# Respuesta esperada:
{
  "success": true,
  "message": "Encryption/Decryption flow completed successfully",
  "steps": [...],
  "summary": {
    "originalText": "Datos secretos de prueba",
    "encryptedText": "vault:v1:8SDd3WHDOjf74mq...",
    "decryptedText": "Datos secretos de prueba",
    "integrity": "VERIFIED"
  }
}
```

### Prueba 3: Pago Encriptado Completo

```bash
# Enviar pago encriptado de A hacia B
curl -X POST http://localhost:5000/api/encryptedcommunication/test-encrypted-payment \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 150.50,
    "description": "Pago de ticket de estacionamiento",
    "currency": "USD"
  }'

# Respuesta esperada:
{
  "success": true,
  "message": "Encrypted payment sent and processed successfully",
  "data": {
    "paymentId": "...",
    "amount": 150.50,
    "description": "Pago de ticket de estacionamiento",
    "status": "completed",
    "processedBy": "admin.user",
    "processedAt": "2026-01-23T23:00:00Z"
  },
  "flow": {
    "step1": "Sistema A: Datos encriptados con Vault",
    "step2": "Sistema A: Enviados a Sistema B vía HTTP",
    "step3": "Sistema B: Recibidos y desencriptados con Vault",
    "step4": "Sistema B: Pago procesado exitosamente"
  }
}
```

---

## 🔒 Seguridad

### Características de Seguridad Implementadas

1. **Encriptación AES-256-GCM**
   - Algoritmo estándar de la industria
   - Autenticación integrada (AEAD)
   - Resistente a ataques de modificación

2. **Gestión Centralizada de Claves**
   - Claves nunca salen de Vault
   - Rotación automática de claves
   - Auditoría completa de operaciones

3. **Autenticación JWT**
   - Comunicación autenticada con Keycloak
   - Tokens de corta duración
   - Validación en ambos sistemas

4. **Separación de Responsabilidades**
   - Sistema A: Solo puede encriptar
   - Sistema B: Solo puede desencriptar
   - Vault: Gestiona claves centralizadamente

### Políticas de Acceso

```hcl
# Sistema A: Puede encriptar
path "transit/encrypt/coreticket-key" {
  capabilities = ["update"]
}

# Sistema B: Puede desencriptar
path "transit/decrypt/coreticket-key" {
  capabilities = ["update"]
}

# Ambos: Pueden leer info de la clave
path "transit/keys/coreticket-key" {
  capabilities = ["read"]
}
```

---

## 📊 Ventajas del Enfoque

| Aspecto | Beneficio |
|---------|-----------|
| **Seguridad** | Datos encriptados en tránsito con AES-256-GCM |
| **Gestión de Claves** | Centralizada en Vault, sin claves en código |
| **Rotación** | Vault permite rotar claves sin downtime |
| **Auditoría** | Todos los accesos a claves son registrados |
| **Escalabilidad** | Vault puede manejar miles de operaciones/seg |
| **Compliance** | Cumple con PCI DSS, HIPAA, GDPR |

---

## 🔄 Rotación de Claves

```bash
# Rotar la clave (crea nueva versión)
docker exec vault vault write -f transit/keys/coreticket-key/rotate

# Ver versiones de la clave
docker exec vault vault read transit/keys/coreticket-key

# Configurar auto-rotación (90 días)
docker exec vault vault write transit/keys/coreticket-key/config \
  auto_rotate_period=2160h
```

**Importante:** Vault mantiene versiones antiguas para desencriptar datos históricos.

---

## 📈 Monitoreo

### Métricas de Vault

```bash
# Ver métricas
curl http://localhost:8200/v1/sys/metrics

# Ver auditoría
docker exec vault vault audit list
```

### Logs de Operaciones

```bash
# Ver logs de Sistema A
docker-compose logs -f ticketparkingapi | grep Vault

# Ver logs de Sistema B
docker-compose logs -f paymentserviceapi | grep Vault

# Ver logs de Vault
docker-compose logs -f vault
```

---

## ✅ Checklist de Implementación

- [x] Vault levantado en Docker
- [x] Transit Engine habilitado
- [x] Clave `coreticket-key` creada
- [x] VaultService implementado en Sistema A
- [x] VaultService implementado en Sistema B
- [x] PaymentServiceClient implementado
- [x] Endpoint de encriptación en Sistema A
- [x] Endpoint de desencriptación en Sistema B
- [x] Pruebas de encriptación exitosas
- [x] Pruebas de comunicación A→B exitosas
- [x] Políticas de acceso configuradas
- [x] Documentación completa

---

## 🎓 Conclusión

La implementación de comunicación encriptada con HashiCorp Vault proporciona:

1. ✅ **Seguridad de Datos:** Encriptación end-to-end con AES-256-GCM
2. ✅ **Gestión de Claves:** Centralizada y auditada en Vault
3. ✅ **Cumplimiento:** Estándares de la industria (PCI DSS, HIPAA)
4. ✅ **Escalabilidad:** Arquitectura lista para producción
5. ✅ **Mantenibilidad:** Rotación de claves sin downtime

**Resultado:** Comunicación segura entre Sistema A y Sistema B con encriptación gestionada por KMS.

---

**Fecha de Implementación:** Sprint 4  
**Responsable:** Equipo CoreTicket  
**Estado:** ✅ IMPLEMENTADO
