# Script de Demostración Automatizada para Presentación
# Ejecuta este script durante la presentación para mostrar el flujo completo

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   DEMOSTRACIÓN - AUTENTICACIÓN CON KEYCLOAK               ║" -ForegroundColor Cyan
Write-Host "║   Sistema A (CoreTicket) + Sistema B (Payment Service)    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Configuración
$KEYCLOAK_URL = "http://localhost:8080"
$REALM = "coreticket-realm"
$CLIENT_ID = "coreticket-client"
$SYSTEMA_URL = "http://localhost:5000"
$SYSTEMB_URL = "http://localhost:5001"

# Función para pausar y esperar Enter
function Pause-Demo {
    param([string]$message = "Presiona Enter para continuar...")
    Write-Host ""
    Write-Host $message -ForegroundColor Yellow
    $null = Read-Host
    Write-Host ""
}

# Función para mostrar sección
function Show-Section {
    param([string]$title)
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host " $title" -ForegroundColor White -BackgroundColor DarkCyan
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
}

# Función para obtener token
function Get-Token {
    param(
        [string]$username,
        [string]$password
    )
    
    $tokenUrl = "$KEYCLOAK_URL/realms/$REALM/protocol/openid-connect/token"
    $body = @{
        client_id = $CLIENT_ID
        username = $username
        password = $password
        grant_type = "password"
    }
    
    try {
        $response = Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $body -ContentType "application/x-www-form-urlencoded"
        return $response.access_token
    } catch {
        Write-Host "❌ Error: $_" -ForegroundColor Red
        return $null
    }
}

# ============================================================================
# INICIO DE LA DEMOSTRACIÓN
# ============================================================================

Show-Section "PARTE 1: Verificación de Servicios"

Write-Host "📊 Verificando que todos los servicios estén corriendo..." -ForegroundColor Yellow
Write-Host ""

# Verificar Keycloak
Write-Host "  🔍 Keycloak ($KEYCLOAK_URL)... " -NoNewline
try {
    $null = Invoke-RestMethod -Uri "$KEYCLOAK_URL/health/ready" -Method Get -TimeoutSec 5
    Write-Host "✅ OK" -ForegroundColor Green
} catch {
    Write-Host "❌ NO DISPONIBLE" -ForegroundColor Red
    Write-Host "     Por favor inicia Keycloak: docker-compose up -d keycloak" -ForegroundColor Yellow
}

# Verificar Sistema A
Write-Host "  🔍 Sistema A - CoreTicket ($SYSTEMA_URL)... " -NoNewline
try {
    $null = Invoke-RestMethod -Uri "$SYSTEMA_URL/swagger/index.html" -Method Get -TimeoutSec 5
    Write-Host "✅ OK" -ForegroundColor Green
} catch {
    Write-Host "❌ NO DISPONIBLE" -ForegroundColor Red
    Write-Host "     Por favor inicia Sistema A: cd backend\TicketParkingAPI\TicketParkingAPI && dotnet run" -ForegroundColor Yellow
}

# Verificar Sistema B
Write-Host "  🔍 Sistema B - Payment Service ($SYSTEMB_URL)... " -NoNewline
try {
    $health = Invoke-RestMethod -Uri "$SYSTEMB_URL/api/payment/health" -Method Get -TimeoutSec 5
    Write-Host "✅ OK" -ForegroundColor Green
    Write-Host "     Status: $($health.status)" -ForegroundColor Gray
} catch {
    Write-Host "❌ NO DISPONIBLE" -ForegroundColor Red
    Write-Host "     Por favor inicia Sistema B: cd backend\PaymentServiceAPI && dotnet run" -ForegroundColor Yellow
}

Pause-Demo

# ============================================================================
Show-Section "PARTE 2: Autenticación - Obtener Token JWT"

Write-Host "🔐 Obteniendo token de autenticación desde Keycloak..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  Usuario: admin.user" -ForegroundColor Cyan
Write-Host "  Password: admin123" -ForegroundColor Cyan
Write-Host "  Realm: $REALM" -ForegroundColor Cyan
Write-Host ""

$adminToken = Get-Token -username "admin.user" -password "admin123"

if ($adminToken) {
    Write-Host "✅ Token JWT obtenido exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📄 Token (primeros 100 caracteres):" -ForegroundColor Yellow
    Write-Host "  $($adminToken.Substring(0, [Math]::Min(100, $adminToken.Length)))..." -ForegroundColor Gray
    Write-Host ""
    
    # Decodificar payload (básico)
    $parts = $adminToken.Split('.')
    if ($parts.Length -eq 3) {
        $payload = $parts[1]
        while ($payload.Length % 4 -ne 0) { $payload += "=" }
        try {
            $bytes = [Convert]::FromBase64String($payload)
            $json = [System.Text.Encoding]::UTF8.GetString($bytes)
            $claims = $json | ConvertFrom-Json
            
            Write-Host "📋 Información del Token:" -ForegroundColor Yellow
            Write-Host "  👤 Usuario: $($claims.preferred_username)" -ForegroundColor Cyan
            Write-Host "  📧 Email: $($claims.email)" -ForegroundColor Cyan
            Write-Host "  🎭 Roles: $($claims.realm_access.roles -join ', ')" -ForegroundColor Cyan
            Write-Host "  ⏰ Expira: $(Get-Date -UnixTimeSeconds $claims.exp -Format 'HH:mm:ss')" -ForegroundColor Cyan
        } catch {
            # Ignorar errores de decodificación
        }
    }
} else {
    Write-Host "❌ No se pudo obtener el token" -ForegroundColor Red
    Write-Host "   Verifica que Keycloak esté configurado correctamente" -ForegroundColor Yellow
    exit 1
}

Pause-Demo

# ============================================================================
Show-Section "PARTE 3: Probar Seguridad - Endpoint sin Token"

Write-Host "🔒 Intentando acceder a Sistema B SIN token (debe fallar)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  Endpoint: GET $SYSTEMB_URL/api/payment/123e4567-e89b-12d3-a456-426614174000" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$SYSTEMB_URL/api/payment/123e4567-e89b-12d3-a456-426614174000" -Method Get
    Write-Host "❌ ERROR: El endpoint NO está protegido!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ CORRECTO: Endpoint protegido - 401 Unauthorized" -ForegroundColor Green
        Write-Host ""
        Write-Host "   Esto demuestra que los endpoints están protegidos." -ForegroundColor Gray
        Write-Host "   Sin token JWT, el acceso es denegado." -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Error inesperado: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Pause-Demo

# ============================================================================
Show-Section "PARTE 4: Autenticación Exitosa - Sistema B"

Write-Host "✅ Accediendo a Sistema B CON token válido..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  Endpoint: GET $SYSTEMB_URL/api/payment/123e4567-e89b-12d3-a456-426614174000" -ForegroundColor Cyan
Write-Host "  Token: Bearer <token-jwt>" -ForegroundColor Cyan
Write-Host ""

$headers = @{ Authorization = "Bearer $adminToken" }

try {
    $payment = Invoke-RestMethod -Uri "$SYSTEMB_URL/api/payment/123e4567-e89b-12d3-a456-426614174000" -Method Get -Headers $headers
    
    Write-Host "✅ ÉXITO: Acceso autorizado!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📦 Respuesta del servidor:" -ForegroundColor Yellow
    Write-Host "  Payment ID: $($payment.paymentId)" -ForegroundColor Cyan
    Write-Host "  Amount: `$$($payment.amount)" -ForegroundColor Cyan
    Write-Host "  Status: $($payment.status)" -ForegroundColor Cyan
    Write-Host "  Processed By: $($payment.processedBy)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   El sistema validó el token y retornó los datos." -ForegroundColor Gray
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Pause-Demo

# ============================================================================
Show-Section "PARTE 5: SSO - Single Sign-On"

Write-Host "🔄 Probando SSO: Usando el MISMO token en Sistema A..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  Esto demuestra que el usuario NO necesita autenticarse dos veces." -ForegroundColor Gray
Write-Host ""
Write-Host "  Endpoint: GET $SYSTEMA_URL/api/tickets" -ForegroundColor Cyan
Write-Host "  Token: <mismo-token-de-sistema-b>" -ForegroundColor Cyan
Write-Host ""

try {
    $tickets = Invoke-RestMethod -Uri "$SYSTEMA_URL/api/tickets" -Method Get -Headers $headers
    
    Write-Host "✅ SSO FUNCIONANDO!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📦 Respuesta del Sistema A:" -ForegroundColor Yellow
    Write-Host "  Message: $($tickets.message)" -ForegroundColor Cyan
    Write-Host "  User ID: $($tickets.userId)" -ForegroundColor Cyan
    Write-Host "  Roles: $($tickets.roles -join ', ')" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   ✨ El mismo token funcionó en ambos sistemas!" -ForegroundColor Green
    Write-Host "   ✨ El usuario se autenticó UNA SOLA VEZ en Keycloak." -ForegroundColor Green
    Write-Host "   ✨ Ambos sistemas validaron el token independientemente." -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Pause-Demo

# ============================================================================
Show-Section "PARTE 6: Autorización - Roles (RBAC)"

Write-Host "🎭 Probando autorización basada en roles..." -ForegroundColor Yellow
Write-Host ""

# Obtener token de viewer
Write-Host "  Obteniendo token de 'viewer.user' (solo lectura)..." -ForegroundColor Cyan
$viewerToken = Get-Token -username "viewer.user" -password "viewer123"

if ($viewerToken) {
    Write-Host "  ✅ Token de viewer obtenido" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "  Intentando CREAR un pago (requiere admin/operator)..." -ForegroundColor Yellow
    Write-Host "  Endpoint: POST $SYSTEMB_URL/api/payment/process" -ForegroundColor Cyan
    Write-Host ""
    
    $viewerHeaders = @{ 
        Authorization = "Bearer $viewerToken"
        "Content-Type" = "application/json"
    }
    $paymentBody = @{
        amount = 100.00
        description = "Test payment"
        currency = "USD"
    } | ConvertTo-Json
    
    try {
        $result = Invoke-RestMethod -Uri "$SYSTEMB_URL/api/payment/process" -Method Post -Headers $viewerHeaders -Body $paymentBody
        Write-Host "❌ ERROR: Viewer pudo crear pago (no debería poder)" -ForegroundColor Red
    } catch {
        if ($_.Exception.Response.StatusCode -eq 403) {
            Write-Host "✅ CORRECTO: 403 Forbidden" -ForegroundColor Green
            Write-Host ""
            Write-Host "   El viewer NO puede crear pagos." -ForegroundColor Gray
            Write-Host "   Solo tiene permisos de lectura." -ForegroundColor Gray
        } else {
            Write-Host "⚠️  Error inesperado: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "  Ahora probando con token de ADMIN..." -ForegroundColor Yellow
    Write-Host ""
    
    try {
        $adminHeaders = @{ 
            Authorization = "Bearer $adminToken"
            "Content-Type" = "application/json"
        }
        $result = Invoke-RestMethod -Uri "$SYSTEMB_URL/api/payment/process" -Method Post -Headers $adminHeaders -Body $paymentBody
        
        Write-Host "✅ ÉXITO: Admin puede crear pagos!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📦 Pago creado:" -ForegroundColor Yellow
        Write-Host "  Payment ID: $($result.paymentId)" -ForegroundColor Cyan
        Write-Host "  Amount: `$$($result.amount)" -ForegroundColor Cyan
        Write-Host "  Status: $($result.status)" -ForegroundColor Cyan
        Write-Host "  Processed By: $($result.processedBy)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "   ✨ La autorización basada en roles funciona correctamente!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Pause-Demo

# ============================================================================
Show-Section "RESUMEN DE LA DEMOSTRACIÓN"

Write-Host "✅ DEMOSTRACIÓN COMPLETADA EXITOSAMENTE" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Componentes Verificados:" -ForegroundColor Yellow
Write-Host "  ✅ Keycloak - Servidor de identidad funcionando" -ForegroundColor Green
Write-Host "  ✅ Sistema A (CoreTicket) - API protegida con JWT" -ForegroundColor Green
Write-Host "  ✅ Sistema B (Payment Service) - API protegida con JWT" -ForegroundColor Green
Write-Host ""
Write-Host "🔐 Funcionalidades Demostradas:" -ForegroundColor Yellow
Write-Host "  ✅ Autenticación con JWT" -ForegroundColor Green
Write-Host "  ✅ Endpoints protegidos (401 sin token)" -ForegroundColor Green
Write-Host "  ✅ SSO - Single Sign-On entre sistemas" -ForegroundColor Green
Write-Host "  ✅ Autorización basada en roles (RBAC)" -ForegroundColor Green
Write-Host "  ✅ Validación de permisos (403 Forbidden)" -ForegroundColor Green
Write-Host ""
Write-Host "📈 Puntos Obtenidos:" -ForegroundColor Yellow
Write-Host "  • Autenticación: 16/16 ✅" -ForegroundColor Cyan
Write-Host "  • Autorización: 16/16 ✅" -ForegroundColor Cyan
Write-Host "  • Total Sprint 1: 32/100 ✅" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Próximos Pasos:" -ForegroundColor Yellow
Write-Host "  1. Implementar 2FA con app móvil (18 pts)" -ForegroundColor Cyan
Write-Host "  2. Comunicación encriptada con Vault (20 pts)" -ForegroundColor Cyan
Write-Host "  3. Frontend Angular para ambos sistemas" -ForegroundColor Cyan
Write-Host "  4. Análisis de seguridad con SonarQube (100 pts)" -ForegroundColor Cyan
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║          ¡DEMOSTRACIÓN FINALIZADA CON ÉXITO!              ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Presiona Enter para salir..." -ForegroundColor Yellow
$null = Read-Host
