# Script para corregir el cliente payment-client en Keycloak
# Cambia el cliente de confidencial a publico

Write-Host "Corrigiendo cliente payment-client en Keycloak" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

$KEYCLOAK_URL = "http://localhost:8080"
$ADMIN_USER = "admin"
$ADMIN_PASS = "admin"
$REALM = "coreticket-realm"

# Funcion para obtener token de admin
function Get-AdminToken {
    try {
        $response = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" `
            -Method Post `
            -Body @{
                client_id = "admin-cli"
                username = $ADMIN_USER
                password = $ADMIN_PASS
                grant_type = "password"
            } `
            -ContentType "application/x-www-form-urlencoded"
        
        return $response.access_token
    } catch {
        Write-Host "Error obteniendo token de admin: $_" -ForegroundColor Red
        return $null
    }
}

Write-Host "Paso 1: Obteniendo token de administrador..." -ForegroundColor Yellow
$token = Get-AdminToken

if (-not $token) {
    Write-Host "No se pudo obtener el token. Verifica que Keycloak este corriendo." -ForegroundColor Red
    exit 1
}

Write-Host "Token obtenido exitosamente" -ForegroundColor Green
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Obtener ID del cliente payment-client
Write-Host ""
Write-Host "Paso 2: Buscando cliente payment-client..." -ForegroundColor Yellow

try {
    $clients = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients?clientId=payment-client" `
        -Method Get `
        -Headers $headers
    
    if ($clients.Count -eq 0) {
        Write-Host "Cliente payment-client no encontrado" -ForegroundColor Red
        exit 1
    }
    
    $clientId = $clients[0].id
    Write-Host "Cliente encontrado (ID: $clientId)" -ForegroundColor Green
} catch {
    Write-Host "Error buscando cliente: $_" -ForegroundColor Red
    exit 1
}

# Actualizar el cliente a publico
Write-Host ""
Write-Host "Paso 3: Actualizando cliente a publico..." -ForegroundColor Yellow

$updateBody = @{
    id = $clientId
    clientId = "payment-client"
    enabled = $true
    publicClient = $true
    directAccessGrantsEnabled = $true
    standardFlowEnabled = $true
    implicitFlowEnabled = $false
    serviceAccountsEnabled = $false
    authorizationServicesEnabled = $false
    redirectUris = @("http://localhost:62579/*", "http://localhost:*")
    webOrigins = @("http://localhost:62579", "http://localhost:*")
    protocol = "openid-connect"
    attributes = @{
        "pkce.code.challenge.method" = "S256"
    }
} | ConvertTo-Json -Depth 10

try {
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients/$clientId" `
        -Method Put `
        -Headers $headers `
        -Body $updateBody | Out-Null
    Write-Host "Cliente actualizado a publico exitosamente" -ForegroundColor Green
} catch {
    Write-Host "Error actualizando cliente: $_" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Green
Write-Host "CLIENTE CORREGIDO EXITOSAMENTE" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Configuracion actualizada:" -ForegroundColor Cyan
Write-Host "  - Cliente: payment-client" -ForegroundColor White
Write-Host "  - Tipo: Publico (SPA)" -ForegroundColor White
Write-Host "  - Redirect URIs: http://localhost:62579/*" -ForegroundColor White
Write-Host "  - Web Origins: http://localhost:62579" -ForegroundColor White
Write-Host ""
Write-Host "Ahora recarga la pagina en el navegador (F5) y vuelve a hacer login" -ForegroundColor Green
Write-Host ""
