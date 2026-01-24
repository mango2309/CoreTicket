# Configuración
$BaseUrl = "http://localhost:5062/api/EncryptedCommunication"

Write-Host "PRUEBA DE ESTADO DE SEGURIDAD (KMS Y SISTEMAS)" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Función auxiliar para imprimir estado
function Print-Status {
    param (
        [string]$Name,
        [string]$Status,
        [string]$Address
    )
    
    if ($Status -eq "healthy") {
        Write-Host "OK: $Name" -ForegroundColor Green
        Write-Host "    Estado    : $Status" -ForegroundColor Green
        Write-Host "    Direccion : $Address" -ForegroundColor Gray
    } else {
        Write-Host "ERROR: $Name" -ForegroundColor Red
        Write-Host "    Estado    : $Status" -ForegroundColor Red
        Write-Host "    Direccion : $Address" -ForegroundColor Gray
    }
    Write-Host ""
}

# 1. Verificar HashiCorp Vault (KMS)
Write-Host "1. Verificando conexion con KMS (Key Management Service)..." -ForegroundColor Yellow
try {
    $vaultHealth = Invoke-RestMethod -Uri "$BaseUrl/vault/health" -Method Get -ErrorAction Stop
    Print-Status -Name "HashiCorp Vault" -Status $vaultHealth.status -Address $vaultHealth.address
} catch {
    Write-Host "ERROR conectando con la API de verificacion de Vault" -ForegroundColor Red
    Write-Host "Detalle: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 2. Verificar Payment Service (Sistema B)
Write-Host "2. Verificando conexion segura con Sistema B (Payment Service)..." -ForegroundColor Yellow
try {
    $paymentHealth = Invoke-RestMethod -Uri "$BaseUrl/payment-service/health" -Method Get -ErrorAction Stop
    Print-Status -Name "Payment Service API (Sistema B)" -Status $paymentHealth.status -Address $paymentHealth.address
} catch {
    Write-Host "ERROR conectando con la API de verificacion de Payment Service" -ForegroundColor Red
    Write-Host "Detalle: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "Interpretacion de Resultados:" -ForegroundColor Cyan
Write-Host "- Si Vault esta 'healthy', la encriptacion/desencriptacion funcionara correctamente." -ForegroundColor Gray
Write-Host "- Si Payment Service esta 'healthy', la comunicacion segura entre sistemas es posible." -ForegroundColor Gray
Write-Host ""
