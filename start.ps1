# Script de inicio rápido para Sprint 1 (Windows PowerShell)

Write-Host "🚀 Iniciando CoreTicket - Sprint 1" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
Write-Host "📦 Verificando Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✅ Docker está corriendo" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está corriendo. Por favor inicia Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Levantar infraestructura
Write-Host "🐳 Levantando Keycloak y bases de datos..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "⏳ Esperando a que Keycloak inicie (esto puede tomar 1-2 minutos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 60

# Verificar servicios
Write-Host ""
Write-Host "📊 Estado de servicios:" -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "✅ Infraestructura lista!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Configura Keycloak siguiendo: docs/KEYCLOAK_SETUP.md"
Write-Host "2. Ejecuta Sistema A:"
Write-Host "   cd backend\TicketParkingAPI\TicketParkingAPI"
Write-Host "   dotnet run"
Write-Host "3. Ejecuta Sistema B (en otra terminal):"
Write-Host "   cd backend\PaymentServiceAPI"
Write-Host "   dotnet run --urls http://localhost:5001"
Write-Host "4. Ejecuta Frontend (en otra terminal):"
Write-Host "   cd frontend\ticket-parking"
Write-Host "   npm install"
Write-Host "   npm start"
Write-Host ""
Write-Host "🌐 URLs importantes:" -ForegroundColor Cyan
Write-Host "  - Keycloak Admin: http://localhost:8080 (admin/admin)"
Write-Host "  - Sistema A API: http://localhost:5000/swagger"
Write-Host "  - Sistema B API: http://localhost:5001/swagger"
Write-Host "  - Frontend: http://localhost:4200"
