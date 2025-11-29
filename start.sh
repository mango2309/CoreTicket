#!/bin/bash
# Script de inicio rápido para Sprint 1

echo "🚀 Iniciando CoreTicket - Sprint 1"
echo "===================================="
echo ""

# Verificar Docker
echo "📦 Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker Desktop."
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker no está corriendo. Por favor inicia Docker Desktop."
    exit 1
fi

echo "✅ Docker está corriendo"
echo ""

# Levantar infraestructura
echo "🐳 Levantando Keycloak y bases de datos..."
docker-compose up -d

echo ""
echo "⏳ Esperando a que Keycloak inicie (esto puede tomar 1-2 minutos)..."
sleep 60

# Verificar servicios
echo ""
echo "📊 Estado de servicios:"
docker-compose ps

echo ""
echo "✅ Infraestructura lista!"
echo ""
echo "📝 Próximos pasos:"
echo "1. Configura Keycloak siguiendo: docs/KEYCLOAK_SETUP.md"
echo "2. Ejecuta Sistema A: cd backend/TicketParkingAPI/TicketParkingAPI && dotnet run"
echo "3. Ejecuta Sistema B: cd backend/PaymentServiceAPI && dotnet run --urls http://localhost:5001"
echo "4. Ejecuta Frontend: cd frontend/ticket-parking && npm install && npm start"
echo ""
echo "🌐 URLs importantes:"
echo "  - Keycloak Admin: http://localhost:8080 (admin/admin)"
echo "  - Sistema A API: http://localhost:5000/swagger"
echo "  - Sistema B API: http://localhost:5001/swagger"
echo "  - Frontend: http://localhost:4200"
