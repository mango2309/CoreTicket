# Guía Visual de Configuración de Keycloak

Esta guía te llevará paso a paso para configurar Keycloak para el proyecto CoreTicket.

## ✅ Paso 1: Acceder a Keycloak

Keycloak está corriendo en: **http://localhost:8080**

![Keycloak Login](file:///C:/Users/sebas/.gemini/antigravity/brain/c8860d21-07cc-4b51-be1a-75f8f88accdf/keycloak_login_page_1764270632408.png)

**Credenciales:**
- Usuario: `admin`
- Password: `admin`

## ✅ Paso 2: Consola de Administración

Después de iniciar sesión, verás la consola principal:

![Keycloak Admin Console](file:///C:/Users/sebas/.gemini/antigravity/brain/c8860d21-07cc-4b51-be1a-75f8f88accdf/keycloak_admin_console_1764270653111.png)

---

## 📋 Paso 3: Crear Realm

1. En el menú superior izquierdo, haz clic en el dropdown que dice **"master"**
2. Click en **"Create Realm"**
3. **Realm name**: `coreticket-realm`
4. Click **"Create"**

---

## 🔑 Paso 4: Crear Cliente para Sistema A

1. En el menú lateral, ve a **Clients**
2. Click **"Create client"**

### Configuración General
- **Client type**: `OpenID Connect`
- **Client ID**: `coreticket-client`
- Click **"Next"**

### Capability Config
- ✅ **Client authentication**: `OFF` (cliente público para Angular)
- ✅ **Authorization**: `OFF`
- ✅ **Standard flow**: `ON`
- ✅ **Direct access grants**: `ON`
- Click **"Next"**

### Login Settings
- **Valid redirect URIs**: `http://localhost:4200/*`
- **Valid post logout redirect URIs**: `http://localhost:4200/*`
- **Web origins**: `http://localhost:4200`
- Click **"Save"**

---

## 🔑 Paso 5: Crear Cliente para Sistema B

1. En **Clients**, click **"Create client"**

### Configuración General
- **Client type**: `OpenID Connect`
- **Client ID**: `payment-client`
- Click **"Next"**

### Capability Config
- ✅ **Client authentication**: `ON` (cliente confidencial)
- ✅ **Authorization**: `OFF`
- ✅ **Standard flow**: `ON`
- ✅ **Direct access grants**: `ON`
- Click **"Next"**

### Login Settings
- **Valid redirect URIs**: `*`
- **Web origins**: `*`
- Click **"Save"**

> **⚠️ IMPORTANTE**: Ve a la pestaña **Credentials** y copia el **Client secret**. Lo necesitarás para configurar Sistema B.

---

## 👥 Paso 6: Crear Roles

1. En el menú lateral, ve a **Realm roles**
2. Click **"Create role"**

Crea los siguientes roles:

### Role 1: admin
- **Role name**: `admin`
- **Description**: `Administrator with full access`
- Click **"Save"**

### Role 2: operator
- **Role name**: `operator`
- **Description**: `Operator with limited access`
- Click **"Save"**

### Role 3: viewer
- **Role name**: `viewer`
- **Description**: `Viewer with read-only access`
- Click **"Save"**

---

## 👤 Paso 7: Crear Usuarios de Prueba

### Usuario 1: Admin

1. En el menú lateral, ve a **Users**
2. Click **"Add user"**
3. Configuración:
   - **Username**: `admin.user`
   - **Email**: `admin@coreticket.com`
   - **First name**: `Admin`
   - **Last name**: `User`
   - ✅ **Email verified**: `ON`
   - Click **"Create"**

4. **Pestaña Credentials**:
   - Click **"Set password"**
   - **Password**: `admin123`
   - **Password confirmation**: `admin123`
   - ❌ **Temporary**: `OFF`
   - Click **"Save"**

5. **Pestaña Role mapping**:
   - Click **"Assign role"**
   - Selecciona `admin`
   - Click **"Assign"**

### Usuario 2: Operator

Repite el proceso con:
- **Username**: `operator.user`
- **Email**: `operator@coreticket.com`
- **Password**: `operator123`
- **Role**: `operator`

### Usuario 3: Viewer

Repite el proceso con:
- **Username**: `viewer.user`
- **Email**: `viewer@coreticket.com`
- **Password**: `viewer123`
- **Role**: `viewer`

---

## ✅ Paso 8: Verificar Configuración

### Probar con cURL (PowerShell)

```powershell
# Obtener token para admin
$response = Invoke-RestMethod -Uri "http://localhost:8080/realms/coreticket-realm/protocol/openid-connect/token" `
  -Method Post `
  -Body @{
    client_id = "coreticket-client"
    username = "admin.user"
    password = "admin123"
    grant_type = "password"
  } `
  -ContentType "application/x-www-form-urlencoded"

$token = $response.access_token
Write-Host "Token obtenido: $($token.Substring(0,50))..."
```

### Decodificar Token

Copia el token y pégalo en https://jwt.io para ver los claims, incluyendo los roles.

---

## 🎯 Resumen de Configuración

| Elemento | Valor |
|----------|-------|
| **Realm** | coreticket-realm |
| **Cliente A** | coreticket-client (público) |
| **Cliente B** | payment-client (confidencial) |
| **Roles** | admin, operator, viewer |
| **Usuarios** | admin.user, operator.user, viewer.user |

---

## 🚀 Próximos Pasos

Una vez completada la configuración:

1. ✅ Ejecuta el script de prueba: `.\test-auth.ps1`
2. ✅ Verifica que ambos sistemas acepten el token
3. ✅ Prueba los endpoints en Swagger UI
4. ✅ Continúa con la integración del frontend

---

## 📹 Video de Configuración

![Configuración de Keycloak](file:///C:/Users/sebas/.gemini/antigravity/brain/c8860d21-07cc-4b51-be1a-75f8f88accdf/keycloak_configuration_1764270612984.webp)

Este video muestra el proceso completo de acceso a la consola de administración de Keycloak.
