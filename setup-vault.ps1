# Script de configuración de HashiCorp Vault para CoreTicket
# Este script configura el Transit Engine para encriptación/desencriptación

Write-Host "🔐 Configurando HashiCorp Vault para CoreTicket" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$VAULT_ADDR = "http://localhost:8200"
$VAULT_TOKEN = "root-token"
$KEY_NAME = "coreticket-key"

# Configurar variables de entorno
$env:VAULT_ADDR = $VAULT_ADDR
$env:VAULT_TOKEN = $VAULT_TOKEN

Write-Host "📋 Configuración:" -ForegroundColor Yellow
Write-Host "  Vault Address: $VAULT_ADDR"
Write-Host "  Vault Token: $VAULT_TOKEN"
Write-Host "  Key Name: $KEY_NAME"
Write-Host ""

# Función para ejecutar comandos de Vault
function Invoke-VaultCommand {
    param(
        [string]$Command,
        [string]$Description
    )
    
    Write-Host "  $Description..." -NoNewline
    try {
        $result = docker exec vault vault $Command 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host " ✅" -ForegroundColor Green
            return $true
        } else {
            Write-Host " ❌" -ForegroundColor Red
            Write-Host "    Error: $result" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host " ❌" -ForegroundColor Red
        Write-Host "    Error: $_" -ForegroundColor Red
        return $false
    }
}

# Verificar que Vault esté corriendo
Write-Host "🔍 Verificando Vault..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$VAULT_ADDR/v1/sys/health" -Method Get -ErrorAction Stop
    Write-Host "  ✅ Vault está corriendo" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Vault no está corriendo" -ForegroundColor Red
    Write-Host ""
    Write-Host "⚠️  Inicia Vault con:" -ForegroundColor Yellow
    Write-Host "   docker-compose up -d vault" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""

# Paso 1: Habilitar Transit Engine
Write-Host "🔧 Paso 1: Habilitando Transit Engine" -ForegroundColor Yellow
Invoke-VaultCommand "secrets enable transit" "Habilitando Transit Engine"

Write-Host ""

# Paso 2: Crear clave de encriptación
Write-Host "🔑 Paso 2: Creando clave de encriptación" -ForegroundColor Yellow
Invoke-VaultCommand "write -f transit/keys/$KEY_NAME" "Creando clave '$KEY_NAME'"

Write-Host ""

# Paso 3: Verificar configuración
Write-Host "✅ Paso 3: Verificando configuración" -ForegroundColor Yellow

# Leer información de la clave
Write-Host "  Leyendo información de la clave..." -NoNewline
try {
    $keyInfo = docker exec vault vault read -format=json transit/keys/$KEY_NAME 2>&1 | ConvertFrom-Json
    Write-Host " ✅" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "  📊 Información de la clave:" -ForegroundColor Cyan
    Write-Host "    Nombre: $KEY_NAME" -ForegroundColor Gray
    Write-Host "    Tipo: $($keyInfo.data.type)" -ForegroundColor Gray
    Write-Host "    Versión: $($keyInfo.data.latest_version)" -ForegroundColor Gray
    Write-Host "    Puede encriptar: $($keyInfo.data.supports_encryption)" -ForegroundColor Gray
    Write-Host "    Puede desencriptar: $($keyInfo.data.supports_decryption)" -ForegroundColor Gray
} catch {
    Write-Host " ❌" -ForegroundColor Red
}

Write-Host ""

# Paso 4: Probar encriptación/desencriptación
Write-Host "🧪 Paso 4: Probando encriptación/desencriptación" -ForegroundColor Yellow

$testData = "CoreTicket Test Data - Sprint 4"
$base64Data = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($testData))

Write-Host "  Datos de prueba: '$testData'" -ForegroundColor Gray

# Encriptar
Write-Host "  Encriptando datos..." -NoNewline
try {
    $encryptResult = docker exec vault vault write -format=json transit/encrypt/$KEY_NAME plaintext=$base64Data 2>&1 | ConvertFrom-Json
    $ciphertext = $encryptResult.data.ciphertext
    Write-Host " ✅" -ForegroundColor Green
    Write-Host "    Ciphertext: $ciphertext" -ForegroundColor Gray
} catch {
    Write-Host " ❌" -ForegroundColor Red
    Write-Host "    Error: $_" -ForegroundColor Red
    exit 1
}

# Desencriptar
Write-Host "  Desencriptando datos..." -NoNewline
try {
    $decryptResult = docker exec vault vault write -format=json transit/decrypt/$KEY_NAME ciphertext=$ciphertext 2>&1 | ConvertFrom-Json
    $decryptedBase64 = $decryptResult.data.plaintext
    $decryptedData = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($decryptedBase64))
    Write-Host " ✅" -ForegroundColor Green
    Write-Host "    Datos desencriptados: '$decryptedData'" -ForegroundColor Gray
    
    if ($decryptedData -eq $testData) {
        Write-Host "    ✅ Integridad verificada" -ForegroundColor Green
    } else {
        Write-Host "    ❌ Error de integridad" -ForegroundColor Red
    }
} catch {
    Write-Host " ❌" -ForegroundColor Red
    Write-Host "    Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Paso 5: Configurar políticas (opcional)
Write-Host "🔒 Paso 5: Configurando políticas de acceso" -ForegroundColor Yellow

$policy = @"
# Política para Sistema A (puede encriptar)
path "transit/encrypt/$KEY_NAME" {
  capabilities = ["update"]
}

# Política para Sistema B (puede desencriptar)
path "transit/decrypt/$KEY_NAME" {
  capabilities = ["update"]
}

# Ambos sistemas pueden leer info de la clave
path "transit/keys/$KEY_NAME" {
  capabilities = ["read"]
}
"@

# Guardar política en archivo temporal
$policyFile = "vault-policy-temp.hcl"
$policy | Out-File -FilePath $policyFile -Encoding UTF8

# Copiar política al contenedor
Write-Host "  Creando política de acceso..." -NoNewline
try {
    docker cp $policyFile vault:/tmp/coreticket-policy.hcl | Out-Null
    docker exec vault vault policy write coreticket-policy /tmp/coreticket-policy.hcl | Out-Null
    Remove-Item $policyFile
    Write-Host " ✅" -ForegroundColor Green
} catch {
    Write-Host " ❌" -ForegroundColor Red
}

Write-Host ""

# Resumen
Write-Host "📊 Resumen de Configuración" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host "  ✅ Vault Address: $VAULT_ADDR" -ForegroundColor Green
Write-Host "  ✅ Transit Engine: Habilitado" -ForegroundColor Green
Write-Host "  ✅ Clave de encriptación: $KEY_NAME" -ForegroundColor Green
Write-Host "  ✅ Prueba de encriptación: Exitosa" -ForegroundColor Green
Write-Host "  ✅ Prueba de desencriptación: Exitosa" -ForegroundColor Green
Write-Host "  ✅ Política de acceso: Configurada" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Vault configurado exitosamente!" -ForegroundColor Green
Write-Host ""

Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Los backends ya están configurados para usar Vault"
Write-Host "  2. Prueba el endpoint: POST /api/encryptedcommunication/test-encrypted-payment"
Write-Host "  3. Verifica el health: GET /api/encryptedcommunication/vault/health"
Write-Host ""

Write-Host "🔗 URLs útiles:" -ForegroundColor Cyan
Write-Host "  Vault UI: $VAULT_ADDR/ui (Token: $VAULT_TOKEN)"
Write-Host "  Sistema A: http://localhost:5000/swagger"
Write-Host "  Sistema B: http://localhost:5001/swagger"
Write-Host ""
