# CoreTicket - Sistema de Gestión de Parqueo

#Link de video de demostracion: https://vimeo.com/1097396201/b2d182afbd?share=copy

## Principios SOLID y Patrones de Diseño implementados

- **Single Responsibility Principle (SRP):** El cálculo de puntos de lealtad está separado en un servicio especializado, fuera del controlador.
- **Dependency Inversion Principle (DIP):** Los controladores dependen de interfaces y no de implementaciones concretas para los servicios de lógica de negocio.
- **Strategy Pattern:** Se utilizan estrategias intercambiables para el cálculo de puntos de lealtad (por hora, por monto, etc.).
- **Factory Pattern:** Una fábrica selecciona la estrategia adecuada de cálculo de puntos según el contexto.

---

Sistema completo de gestión de parqueo con programa de lealtad, desarrollado con Angular 17 (frontend) y ASP.NET Core (backend).

## Estructura del Proyecto

### Frontend (Angular 17)
```
frontend/ticket-parking/
├── src/app/
│   ├── areas/
│   │   ├── user/
│   │   │   └── user-area.component.ts          # Componente principal del área de usuario
│   │   └── admin/
│   │       └── admin-area.component.ts         # Componente principal del área de administrador
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── components/
│   │   ├── home/
│   │   ├── navbar/
│   │   └── ...
│   ├── core/
│   │   ├── guards/
│   │   ├── services/
│   │   └── models/
│   └── app.routes.ts
```

### Backend (ASP.NET Core)
```
backend/TicketParkingAPI/
├── Controllers/
├── Models/
├── Services/
├── Data/
└── Migrations/
```

## Características Principales

### Área de Usuario (`UserAreaComponent`)
- **Dashboard**: Resumen de puntos de lealtad, tickets pagados, beneficios canjeados
- **Consulta de Tickets**: Buscar y pagar tickets de parqueo
- **Programa de Lealtad**: Ver puntos acumulados y nivel actual
- **Canje de Beneficios**: Canjear puntos por beneficios disponibles
- **Mi Perfil**: Gestionar información personal y estadísticas
- **Historial de Transacciones**: Ver historial de puntos ganados y canjeados

### Área de Administrador (`AdminAreaComponent`)
- **Dashboard**: Estadísticas generales del sistema
- **Gestión de Usuarios**: Crear, editar, eliminar y buscar usuarios
- **Gestión de Tickets**: Ver todos los tickets del sistema
- **Gestión de Beneficios**: Crear, editar y eliminar beneficios del programa de lealtad
- **Reportes**: Estadísticas de ingresos y usuarios

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm
- .NET 8 SDK
- SQL Server

### Frontend
```bash
cd frontend/ticket-parking
npm install
ng serve
```

### Backend
```bash
cd backend/TicketParkingAPI
dotnet restore
dotnet ef database update
dotnet run
```

## Uso del Sistema

### Acceso
- **URL Frontend**: http://localhost:4200
- **URL Backend**: https://localhost:7001

### Flujo de Usuario
1. Registrarse o iniciar sesión
2. Acceder al área de usuario (`/user`)
3. Consultar tickets y realizar pagos
4. Acumular puntos de lealtad
5. Canjear beneficios disponibles

### Flujo de Administrador
1. Iniciar sesión como administrador
2. Acceder al área de administración (`/admin`)
3. Gestionar usuarios, tickets y beneficios
4. Revisar reportes y estadísticas

## Tecnologías Utilizadas

### Frontend
- Angular 17 (Standalone Components)
- Bootstrap 5
- TypeScript
- RxJS

### Backend
- ASP.NET Core 8
- Entity Framework Core
- SQL Server
- JWT Authentication

## Estructura de Datos

### Usuario
- ID, Email, Cédula, Contraseña, Rol

### Ticket
- Código, Usuario, Monto, Estado, Fecha

### Lealtad
- Usuario, Puntos Acumulados, Nivel

### Beneficio
- Nombre, Descripción, Puntos Requeridos, Estado

## Seguridad
- Autenticación JWT
- Guards para protección de rutas
- Roles de usuario y administrador
- Validación de formularios

## Desarrollo
El proyecto está estructurado de manera modular y escalable, permitiendo fácil mantenimiento y extensión de funcionalidades.
