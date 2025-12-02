# Script para actualizar la configuracion del cliente en Keycloak

$KEYCLOAK_URL = "http://localhost:8080"
$ADMIN_USER = "admin"
$ADMIN_PASS = "admin"
$REALM = "coreticket-realm"

Write-Host "Actualizando configuracion del cliente en Keycloak..." -ForegroundColor Cyan

# Obtener token
$tokenResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" `
    -Method Post `
    -Body @{
        client_id = "admin-cli"
        username = $ADMIN_USER
        password = $ADMIN_PASS
        grant_type = "password"
    } `
    -ContentType "application/x-www-form-urlencoded"

$token = $tokenResponse.access_token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Obtener el cliente
$clients = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients?clientId=coreticket-client" `
    -Method Get `
    -Headers $headers

$clientId = $clients[0].id

# Actualizar el cliente
$clientUpdate = @{
    redirectUris = @(
        "http://localhost:4200/*",
        "http://localhost:4200/callback",
        "http://localhost:60816/*",
        "http://localhost:60816/callback",
        "http://localhost:*/callback"
    )
    webOrigins = @(
        "http://localhost:4200",
        "http://localhost:60816",
        "http://localhost:*"
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients/$clientId" `
    -Method Put `
    -Headers $headers `
    -Body $clientUpdate

Write-Host "Cliente actualizado correctamente" -ForegroundColor Green
Write-Host "URLs de callback configuradas" -ForegroundColor Cyan
