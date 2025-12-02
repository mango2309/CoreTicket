# Script de Configuración Automática de Keycloak
# Este script configura el realm, clientes, roles y usuarios en Keycloak

Write-Host "� Configuración Automática de Keycloak" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$KEYCLOAK_URL = "http://localhost:8080"
$ADMIN_USER = "admin"
$ADMIN_PASS = "admin"
$REALM = "coreticket-realm"

# Función para obtener token de admin
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
        Write-Host "❌ Error obteniendo token de admin: $_" -ForegroundColor Red
        return $null
    }
}

Write-Host "1️⃣  Obteniendo token de administrador..." -ForegroundColor Yellow
$token = Get-AdminToken

if (-not $token) {
    Write-Host "❌ No se pudo obtener el token. Verifica que Keycloak esté corriendo." -ForegroundColor Red
    Write-Host "   Ejecuta: docker-compose up -d keycloak" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Token obtenido" -ForegroundColor Green
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Crear Realm
Write-Host ""
Write-Host "2️⃣  Creando realm '$REALM'..." -ForegroundColor Yellow

$realmBody = @{
    realm = $REALM
    enabled = $true
    displayName = "CoreTicket Realm"
    accessTokenLifespan = 900
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms" `
        -Method Post `
        -Headers $headers `
        -Body $realmBody | Out-Null
    Write-Host "✅ Realm creado" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "⚠️  Realm ya existe" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error: $_" -ForegroundColor Red
    }
}

# Crear Cliente para Sistema A (público)
Write-Host ""
Write-Host "3️⃣  Creando cliente 'coreticket-client' (Sistema A)..." -ForegroundColor Yellow

$clientABody = @{
    clientId = "coreticket-client"
    enabled = $true
    publicClient = $true
    directAccessGrantsEnabled = $true
    standardFlowEnabled = $true
    redirectUris = @("http://localhost:4200/*", "http://localhost:60816/*", "http://localhost:*")
    webOrigins = @("http://localhost:4200", "http://localhost:60816", "http://localhost:*")
    protocol = "openid-connect"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients" `
        -Method Post `
        -Headers $headers `
        -Body $clientABody | Out-Null
    Write-Host "✅ Cliente 'coreticket-client' creado" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "⚠️  Cliente ya existe" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error: $_" -ForegroundColor Red
    }
}

# Crear Cliente para Sistema B (confidencial)
Write-Host ""
Write-Host "4️⃣  Creando cliente 'payment-client' (Sistema B)..." -ForegroundColor Yellow

$clientBBody = @{
    clientId = "payment-client"
    enabled = $true
    publicClient = $false
    directAccessGrantsEnabled = $true
    standardFlowEnabled = $true
    serviceAccountsEnabled = $true
    redirectUris = @("*")
    webOrigins = @("*")
    protocol = "openid-connect"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients" `
        -Method Post `
        -Headers $headers `
        -Body $clientBBody | Out-Null
    Write-Host "✅ Cliente 'payment-client' creado" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "⚠️  Cliente ya existe" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error: $_" -ForegroundColor Red
    }
}

# Crear Roles
Write-Host ""
Write-Host "5️⃣  Creando roles..." -ForegroundColor Yellow

$roles = @("admin", "operator", "viewer")

foreach ($role in $roles) {
    $roleBody = @{
        name = $role
        description = "Role $role"
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/roles" `
            -Method Post `
            -Headers $headers `
            -Body $roleBody | Out-Null
        Write-Host "  ✅ Rol '$role' creado" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-Host "  ⚠️  Rol '$role' ya existe" -ForegroundColor Yellow
        } else {
            Write-Host "  ❌ Error creando rol '$role': $_" -ForegroundColor Red
        }
    }
}

# Crear Usuarios
Write-Host ""
Write-Host "6️⃣  Creando usuarios de prueba..." -ForegroundColor Yellow

$users = @(
    @{username="admin.user"; password="admin123"; role="admin"; email="admin@coreticket.com"},
    @{username="operator.user"; password="operator123"; role="operator"; email="operator@coreticket.com"},
    @{username="viewer.user"; password="viewer123"; role="viewer"; email="viewer@coreticket.com"}
)

foreach ($user in $users) {
    $userBody = @{
        username = $user.username
        email = $user.email
        enabled = $true
        emailVerified = $true
        credentials = @(
            @{
                type = "password"
                value = $user.password
                temporary = $false
            }
        )
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/users" `
            -Method Post `
            -Headers $headers `
            -Body $userBody
        
        Write-Host "  ✅ Usuario '$($user.username)' creado" -ForegroundColor Green
        
        # Obtener ID del usuario
        $userId = (Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/users?username=$($user.username)" `
            -Method Get `
            -Headers $headers)[0].id
        
        # Obtener ID del rol
        $roleId = (Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/roles/$($user.role)" `
            -Method Get `
            -Headers $headers).id
        
        # Asignar rol
        $roleMapping = @(
            @{
                id = $roleId
                name = $user.role
            }
        ) | ConvertTo-Json -AsArray
        
        Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/users/$userId/role-mappings/realm" `
            -Method Post `
            -Headers $headers `
            -Body $roleMapping | Out-Null
        
        Write-Host "    → Rol '$($user.role)' asignado" -ForegroundColor Gray
        
    } catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-Host "  ⚠️  Usuario '$($user.username)' ya existe" -ForegroundColor Yellow
        } else {
            Write-Host "  ❌ Error: $_" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║          ✅ CONFIGURACIÓN COMPLETADA                       ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Resumen de Configuración:" -ForegroundColor Cyan
Write-Host "  • Realm: $REALM" -ForegroundColor White
Write-Host "  • Clientes: coreticket-client, payment-client" -ForegroundColor White
Write-Host "  • Roles: admin, operator, viewer" -ForegroundColor White
Write-Host "  • Usuarios: admin.user, operator.user, viewer.user" -ForegroundColor White
Write-Host ""
Write-Host "� Credenciales de Prueba:" -ForegroundColor Cyan
Write-Host "  • admin.user / admin123 (rol: admin)" -ForegroundColor White
Write-Host "  • operator.user / operator123 (rol: operator)" -ForegroundColor White
Write-Host "  • viewer.user / viewer123 (rol: viewer)" -ForegroundColor White
Write-Host ""
Write-Host "🌐 URLs:" -ForegroundColor Cyan
Write-Host "  • Keycloak Admin: http://localhost:8080" -ForegroundColor White
Write-Host "  • Frontend: http://localhost:4200" -ForegroundColor White
Write-Host ""
Write-Host "✨ Ahora puedes hacer clic en 'Iniciar Sesión con Keycloak'" -ForegroundColor Green
Write-Host ""
