# CoreTicket - Proyecto Integrador de Seguridad

Sistema de gestión de tickets de estacionamiento con arquitectura de seguridad completa implementando autenticación, autorización, SSO, 2FA, y comunicación encriptada.

## 🎯 Objetivo del Proyecto

Implementar una solución completa de desarrollo seguro de software que incluye:

- ✅ **Autenticación** con Keycloak y JWT
- ✅ **Autorización** basada en roles (RBAC)
- ✅ **SSO** (Single Sign-On) entre múltiples sistemas
- 🔜 **2FA** (Autenticación de doble factor) con app móvil
- 🔜 **Federación de Usuarios** con base de datos única
- 🔜 **Comunicación Encriptada** entre sistemas usando KMS

## 🏗️ Arquitectura

### Sistemas

- **Sistema A**: CoreTicket (ASP.NET Core 8.0 + Angular 19)
  - Gestión de tickets de estacionamiento
  - Puerto: 5000 (API), 4200 (Frontend)

- **Sistema B**: Payment Service (ASP.NET Core 8.0)
  - Procesamiento de pagos
  - Puerto: 5001

- **Keycloak**: Servidor de identidad y acceso
  - Puerto: 8080

### Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| Backend | ASP.NET Core 8.0 |
| Frontend | Angular 19 |
| Identity Provider | Keycloak 23 |
| Base de Datos | PostgreSQL 15 |
| Containerización | Docker + Docker Compose |
| KMS | HashiCorp Vault (próximo sprint) |

## 🚀 Inicio Rápido

### Prerrequisitos

- Docker Desktop
- .NET 8.0 SDK
- Node.js 18+ y npm
- Git

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd CoreTicket
```

### 2. Levantar Infraestructura

```bash
# Levantar Keycloak y bases de datos
docker-compose up -d

# Verificar que los servicios estén corriendo
docker-compose ps
```

### 3. Configurar Keycloak

Sigue la guía detallada en [`docs/KEYCLOAK_SETUP.md`](./docs/KEYCLOAK_SETUP.md)

**Resumen rápido:**
1. Accede a http://localhost:8080 (admin/admin)
2. Crea el realm `coreticket-realm`
3. Crea los clientes `coreticket-client` y `payment-client`
4. Crea los roles: `admin`, `operator`, `viewer`
5. Crea usuarios de prueba

### 4. Ejecutar Sistema A (CoreTicket API)

```bash
cd backend/TicketParkingAPI/TicketParkingAPI
dotnet restore
dotnet run
```

API disponible en: http://localhost:5000
Swagger UI: http://localhost:5000/swagger

### 5. Ejecutar Sistema B (Payment Service)

```bash
cd backend/PaymentServiceAPI
dotnet restore
dotnet run --urls "http://localhost:5001"
```

API disponible en: http://localhost:5001
Swagger UI: http://localhost:5001/swagger

### 6. Ejecutar Frontend (Angular)

```bash
cd frontend/ticket-parking
npm install
npm start
```

Aplicación disponible en: http://localhost:4200

## 🧪 Probar la Autenticación

### Opción 1: Usando cURL

```bash
# 1. Obtener token
TOKEN=$(curl -s -X POST http://localhost:8080/realms/coreticket-realm/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=coreticket-client" \
  -d "username=admin.user" \
  -d "password=admin123" \
  -d "grant_type=password" | jq -r '.access_token')

# 2. Llamar a Sistema A
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/tickets

# 3. Llamar a Sistema B (mismo token = SSO)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5001/api/payment/health
```

### Opción 2: Usando Swagger UI

1. Ve a http://localhost:5000/swagger
2. Click en "Authorize" 🔓
3. Obtén un token usando el endpoint de Keycloak
4. Pega el token en el campo "Value" con formato: `Bearer <token>`
5. Prueba los endpoints protegidos

### Opción 3: Usando el Frontend

1. Ve a http://localhost:4200
2. Serás redirigido a Keycloak para login
3. Ingresa credenciales (ej: `admin.user` / `admin123`)
4. Serás redirigido de vuelta a la aplicación con sesión activa

## 👥 Usuarios de Prueba

| Usuario | Password | Rol | Permisos |
|---------|----------|-----|----------|
| admin.user | admin123 | admin | Todos los permisos |
| operator.user | operator123 | operator | Crear, leer, actualizar |
| viewer.user | viewer123 | viewer | Solo lectura |

## 📋 Estado del Proyecto

### Sprint 1: Autenticación ✅ (Actual)
- [x] Configurar Docker Compose
- [x] Levantar Keycloak
- [x] Integrar JWT en Sistema A
- [x] Crear Sistema B con autenticación
- [x] Documentar configuración
- [ ] Integrar Angular con Keycloak
- [ ] Tests de autenticación

### Sprint 2: Autorización y SSO 🔜
- [ ] Implementar RBAC granular
- [ ] Configurar SSO entre sistemas
- [ ] Tests de autorización

### Sprint 3: 2FA 🔜
- [ ] Desarrollar app móvil
- [ ] Integrar TOTP
- [ ] Tests end-to-end

### Sprint 4: Encriptación 🔜
- [ ] Configurar HashiCorp Vault
- [ ] Implementar encriptación A → B
- [ ] Tests de seguridad

### Sprint 5: Auditoría 🔜
- [ ] Análisis estático con SonarQube
- [ ] Documentación final
- [ ] Presentación Sprint Review

## 📚 Documentación

- [Configuración de Keycloak](./docs/KEYCLOAK_SETUP.md)
- [Arquitectura de Seguridad](./docs/ARCHITECTURE.md) (en artifacts)
- [Plan de Implementación](./docs/IMPLEMENTATION_PLAN.md) (en artifacts)
- [Plan Sprint 1](./docs/SPRINT_1_PLAN.md) (en artifacts)

## 🛠️ Comandos Útiles

```bash
# Docker
docker-compose up -d              # Levantar servicios
docker-compose down               # Detener servicios
docker-compose logs -f keycloak   # Ver logs de Keycloak
docker-compose ps                 # Ver estado de servicios

# Backend
dotnet restore                    # Restaurar paquetes
dotnet build                      # Compilar
dotnet run                        # Ejecutar
dotnet test                       # Ejecutar tests

# Frontend
npm install                       # Instalar dependencias
npm start                         # Modo desarrollo
npm run build                     # Build producción
npm test                          # Ejecutar tests
```

## 🐛 Troubleshooting

### Keycloak no inicia
```bash
docker-compose logs -f keycloak
docker-compose restart keycloak
```

### API retorna 401 Unauthorized
1. Verifica que Keycloak esté corriendo
2. Verifica que el token no haya expirado (15 min)
3. Verifica la configuración en `appsettings.json`

### Error de conexión a PostgreSQL
```bash
docker-compose ps postgres-systema
docker-compose logs postgres-systema
```

## 📊 Puntuación Esperada

| Criterio | Puntos |
|----------|--------|
| Autenticación | 16 |
| Autorización | 16 |
| SSO | 20 |
| 2FA | 18 |
| Federación de Usuarios | 10 |
| Comunicación Encriptada | 20 |
| **Subtotal** | **100** |
| Metodología Ágil | 100 |
| Keycloak (+complejidad) | 200 |
| Análisis Estático | 100 |
| **Total** | **500** |
| **Nota Final** | **10.00/10** |

## 👨‍💻 Autor

Proyecto Integrador - Desarrollo Seguro de Software

## 📄 Licencia

Este proyecto es para fines educativos.
