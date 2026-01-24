# Federación de Usuarios con Keycloak

## 🎯 Objetivo
Implementar federación de usuarios para permitir autenticación desde múltiples fuentes:
- Base de datos local de Keycloak
- Google (Social Login)
- Microsoft/Azure AD (Enterprise)
- LDAP/Active Directory (opcional)

---

## 📊 Arquitectura de Federación

```
┌─────────────────────────────────────────────────────┐
│                   Keycloak Realm                    │
│                 (coreticket-realm)                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   Local DB   │  │    Google    │  │Microsoft │ │
│  │  (Postgres)  │  │   Identity   │  │Azure AD  │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│         ▲                 ▲                ▲        │
│         │                 │                │        │
│         └─────────────────┴────────────────┘        │
│                   User Federation                   │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Sistema A y Sistema B │
              │   (SSO Compartido)     │
              └───────────────────────┘
```

---

## 🔐 Parte 1: Federación con Google (Social Login)

### 1.1 Crear Credenciales en Google Cloud

1. Ve a: https://console.cloud.google.com
2. Crea un nuevo proyecto: `CoreTicket-Auth`
3. Ve a **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configura:
   - **Application type:** Web application
   - **Name:** CoreTicket Keycloak
   - **Authorized redirect URIs:**
     ```
     http://localhost:8080/realms/coreticket-realm/broker/google/endpoint
     ```
6. Click **Create**
7. **Guarda:** Client ID y Client Secret

### 1.2 Configurar Google Identity Provider en Keycloak

1. Accede a Keycloak Admin: http://localhost:8080
2. Selecciona realm: `coreticket-realm`
3. Ve a **Identity Providers**
4. Click **Add provider** → Selecciona **Google**
5. Configura:

```yaml
Alias: google
Display Name: Google
Enabled: ON
Store Tokens: ON
Stored Tokens Readable: OFF
Trust Email: ON
Account Linking Only: OFF
Hide on Login Page: OFF

Client ID: <TU_GOOGLE_CLIENT_ID>
Client Secret: <TU_GOOGLE_CLIENT_SECRET>

Default Scopes: openid profile email
```

6. Click **Save**

### 1.3 Mapear Atributos de Google

1. En el mismo Identity Provider, ve a la pestaña **Mappers**
2. Click **Add mapper**
3. Crea los siguientes mappers:

**Mapper 1: Email**
```yaml
Name: email
Sync Mode Override: inherit
Mapper Type: Attribute Importer
Claim: email
User Attribute Name: email
```

**Mapper 2: First Name**
```yaml
Name: firstName
Mapper Type: Attribute Importer
Claim: given_name
User Attribute Name: firstName
```

**Mapper 3: Last Name**
```yaml
Name: lastName
Mapper Type: Attribute Importer
Claim: family_name
User Attribute Name: lastName
```

**Mapper 4: Profile Picture**
```yaml
Name: picture
Mapper Type: Attribute Importer
Claim: picture
User Attribute Name: picture
```

### 1.4 Configurar First Login Flow

1. Ve a **Authentication** → **Flows**
2. Selecciona **First Broker Login**
3. Asegúrate de que esté configurado:

```
First Broker Login
├── Review Profile (REQUIRED)
└── Create User If Unique (ALTERNATIVE)
    └── Automatically Set Existing User (ALTERNATIVE)
```

---

## 🏢 Parte 2: Federación con Microsoft Azure AD

### 2.1 Registrar Aplicación en Azure AD

1. Ve a: https://portal.azure.com
2. Navega a **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Configura:
   - **Name:** CoreTicket Keycloak
   - **Supported account types:** Accounts in any organizational directory
   - **Redirect URI:** 
     ```
     http://localhost:8080/realms/coreticket-realm/broker/microsoft/endpoint
     ```
5. Click **Register**
6. **Guarda:** Application (client) ID y Directory (tenant) ID

### 2.2 Crear Client Secret

1. En la app registrada, ve a **Certificates & secrets**
2. Click **New client secret**
3. Descripción: `Keycloak Integration`
4. Expiration: `24 months`
5. Click **Add**
6. **Guarda:** El valor del secret (solo se muestra una vez)

### 2.3 Configurar Permisos

1. Ve a **API permissions**
2. Click **Add a permission** → **Microsoft Graph**
3. Selecciona **Delegated permissions**
4. Añade:
   - `openid`
   - `profile`
   - `email`
   - `User.Read`
5. Click **Add permissions**
6. Click **Grant admin consent** (si eres admin)

### 2.4 Configurar Microsoft Identity Provider en Keycloak

1. En Keycloak, ve a **Identity Providers**
2. Click **Add provider** → Selecciona **Microsoft**
3. Configura:

```yaml
Alias: microsoft
Display Name: Microsoft / Azure AD
Enabled: ON

Application Id: <TU_APPLICATION_CLIENT_ID>
Application Secret: <TU_CLIENT_SECRET>

Default Scopes: openid profile email
```

4. Click **Save**

---

## 🗄️ Parte 3: Federación con Base de Datos Local

### 3.1 Verificar User Storage

Keycloak ya usa PostgreSQL para almacenar usuarios locales.

1. Ve a **User Federation**
2. Deberías ver: **User Storage SPI** (habilitado por defecto)
3. Los usuarios creados manualmente se almacenan en:
   - Base de datos: `postgres-keycloak`
   - Tabla: `user_entity`

### 3.2 Verificar Usuarios Locales

```sql
-- Conectar a la base de datos de Keycloak
docker exec -it postgres-keycloak psql -U keycloak -d keycloak

-- Ver usuarios del realm
SELECT id, username, email, first_name, last_name 
FROM user_entity 
WHERE realm_id = (SELECT id FROM realm WHERE name = 'coreticket-realm');
```

---

## 🔗 Parte 4: Configurar Account Linking

### 4.1 Habilitar Account Linking

Permite que un usuario vincule múltiples identidades (Google, Microsoft, local) a una sola cuenta.

1. Ve a **Identity Providers** → Selecciona **google**
2. Activa: **Account Linking Only:** OFF (para permitir creación automática)
3. Ve a **Authentication** → **Flows** → **First Broker Login**
4. Asegúrate de que **Automatically Set Existing User** esté habilitado

### 4.2 Probar Account Linking

1. Login con Google: `usuario@gmail.com`
2. Keycloak crea cuenta automáticamente
3. Logout
4. Login con Microsoft: mismo email `usuario@gmail.com`
5. Keycloak vincula ambas identidades a la misma cuenta

### 4.3 Ver Identidades Vinculadas

1. Ve a **Users** → Busca el usuario
2. Ve a la pestaña **Identity Provider Links**
3. Verás todas las identidades vinculadas:
   - `google` → `usuario@gmail.com`
   - `microsoft` → `usuario@gmail.com`

---

## 🎨 Parte 5: Personalizar Pantalla de Login

### 5.1 Modificar Tema de Login

1. Ve a **Realm Settings** → **Themes**
2. En **Login Theme**, selecciona: `keycloak` (o crea uno personalizado)
3. Click **Save**

### 5.2 Añadir Botones de Social Login

Los botones de Google y Microsoft aparecerán automáticamente en la pantalla de login:

```
┌─────────────────────────────────┐
│      CoreTicket Login           │
├─────────────────────────────────┤
│  Username: [____________]       │
│  Password: [____________]       │
│                                 │
│  [ Login ]                      │
│                                 │
│  ─────── Or sign in with ────── │
│                                 │
│  [ 🔵 Google ]  [ 🔷 Microsoft ]│
└─────────────────────────────────┘
```

---

## 🧪 Parte 6: Probar Federación

### 6.1 Probar Login con Google

1. Ve a: http://localhost:4200
2. Click **Login**
3. En la pantalla de Keycloak, click **Google**
4. Autoriza el acceso
5. Serás redirigido al dashboard
6. Verifica en Keycloak Admin → Users que el usuario fue creado

### 6.2 Probar Login con Microsoft

1. Logout
2. Click **Login**
3. Click **Microsoft**
4. Login con cuenta de Microsoft
5. Verifica que funcione

### 6.3 Probar Login Local

1. Logout
2. Click **Login**
3. Usa credenciales locales: `admin.user` / `admin123`
4. Verifica que funcione

---

## 📊 Parte 7: Sincronización de Usuarios

### 7.1 Configurar Sincronización Automática

Para sincronizar usuarios desde un directorio externo (LDAP/AD):

1. Ve a **User Federation**
2. Click **Add provider** → **ldap**
3. Configura:

```yaml
Console Display Name: Corporate LDAP
Import Users: ON
Edit Mode: READ_ONLY
Sync Registrations: OFF

Vendor: Active Directory
Connection URL: ldap://ldap.example.com:389
Bind DN: cn=admin,dc=example,dc=com
Bind Credential: <password>

Users DN: ou=users,dc=example,dc=com
Username LDAP attribute: sAMAccountName
RDN LDAP attribute: cn
UUID LDAP attribute: objectGUID
User Object Classes: person, organizationalPerson, user
```

4. Click **Save**
5. Click **Synchronize all users**

### 7.2 Programar Sincronización Periódica

1. En el mismo provider, configura:
   - **Periodic Full Sync:** ON
   - **Full Sync Period:** 86400 (24 horas)
   - **Periodic Changed Users Sync:** ON
   - **Changed Users Sync Period:** 3600 (1 hora)

---

## 🔐 Parte 8: Seguridad de Federación

### 8.1 Configurar Email Verification

1. Ve a **Realm Settings** → **Login**
2. Activa: **Verify email:** ON
3. Configura SMTP en **Realm Settings** → **Email**:

```yaml
Host: smtp.gmail.com
Port: 587
From: noreply@coreticket.com
Enable StartTLS: ON
Enable Authentication: ON
Username: <tu-email@gmail.com>
Password: <app-password>
```

### 8.2 Configurar Políticas de Contraseña

1. Ve a **Authentication** → **Policies** → **Password Policy**
2. Añade políticas:
   - Minimum Length: 8
   - Uppercase Characters: 1
   - Lowercase Characters: 1
   - Digits: 1
   - Special Characters: 1
   - Not Username
   - Not Email

---

## 📈 Parte 9: Monitoreo y Auditoría

### 9.1 Habilitar Event Logging

1. Ve a **Realm Settings** → **Events**
2. En **Event Listeners**, añade: `jboss-logging`
3. En **Login Events Settings**:
   - Save Events: ON
   - Expiration: 7 days
   - Saved Types: Selecciona todos

### 9.2 Ver Eventos de Federación

1. Ve a **Events** → **Login Events**
2. Filtra por:
   - Event Type: `LOGIN`
   - Identity Provider: `google` o `microsoft`
3. Verás todos los logins federados

---

## ✅ Verificación Final

- [ ] Google Identity Provider configurado
- [ ] Microsoft Identity Provider configurado
- [ ] Login con Google funciona
- [ ] Login con Microsoft funciona
- [ ] Login local funciona
- [ ] Account linking funciona
- [ ] Usuarios federados aparecen en Keycloak
- [ ] Eventos de login federado registrados

---

## 📊 Estadísticas de Federación

**Usuarios Totales:** Base de datos única en Keycloak
- Usuarios locales: 3 (admin, operator, viewer)
- Usuarios de Google: Ilimitados
- Usuarios de Microsoft: Ilimitados
- **Total:** Todos en una sola base de datos federada

**Ventajas:**
- ✅ Single Sign-On entre todos los proveedores
- ✅ Gestión centralizada de usuarios
- ✅ Auditoría unificada
- ✅ Políticas de seguridad consistentes

---

## 🎓 Conclusión

La federación de usuarios permite:
1. **Flexibilidad:** Usuarios pueden elegir su método de autenticación
2. **Seguridad:** Aprovecha la seguridad de Google/Microsoft
3. **Experiencia:** Login con un click (social login)
4. **Gestión:** Administración centralizada en Keycloak
5. **Escalabilidad:** Soporta miles de usuarios sin cambios

---

**Fecha de Implementación:** Sprint 2-3  
**Responsable:** Equipo CoreTicket  
**Estado:** ✅ IMPLEMENTADO
