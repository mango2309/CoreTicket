# Configuración de Keycloak - Sprint 1

## 1. Levantar Keycloak

```bash
# Desde la raíz del proyecto
docker-compose up -d keycloak
```

Espera aproximadamente 1-2 minutos para que Keycloak inicie completamente.

## 2. Acceder a la Consola de Administración

- **URL**: http://localhost:8080
- **Usuario**: `admin`
- **Password**: `admin`

## 3. Crear Realm

1. En el menú superior izquierdo, haz clic en el dropdown que dice "master"
2. Click en "Create Realm"
3. **Realm name**: `coreticket-realm`
4. Click "Create"

## 4. Crear Cliente para Sistema A (CoreTicket)

1. En el menú lateral, ve a **Clients**
2. Click "Create client"
3. Configuración:
   - **Client type**: OpenID Connect
   - **Client ID**: `coreticket-client`
   - Click "Next"
4. **Capability config**:
   - ✅ Client authentication: OFF (cliente público)
   - ✅ Authorization: OFF
   - ✅ Standard flow: ON
   - ✅ Direct access grants: ON
   - Click "Next"
5. **Login settings**:
   - **Valid redirect URIs**: `http://localhost:4200/*`
   - **Valid post logout redirect URIs**: `http://localhost:4200/*`
   - **Web origins**: `http://localhost:4200`
   - Click "Save"

## 5. Crear Cliente para Sistema B (Payment Service)

1. En **Clients**, click "Create client"
2. Configuración:
   - **Client type**: OpenID Connect
   - **Client ID**: `payment-client`
   - Click "Next"
3. **Capability config**:
   - ✅ Client authentication: ON (cliente confidencial)
   - ✅ Authorization: OFF
   - ✅ Standard flow: ON
   - ✅ Direct access grants: ON
   - Click "Next"
4. **Login settings**:
   - **Valid redirect URIs**: `*`
   - **Web origins**: `*`
   - Click "Save"
5. Ve a la pestaña **Credentials** y copia el **Client secret** (lo necesitarás después)

## 6. Crear Roles del Realm

1. En el menú lateral, ve a **Realm roles**
2. Click "Create role"
3. Crea los siguientes roles uno por uno:

   **Role 1: admin**
   - **Role name**: `admin`
   - **Description**: `Administrator with full access`
   - Click "Save"

   **Role 2: operator**
   - **Role name**: `operator`
   - **Description**: `Operator with limited access`
   - Click "Save"

   **Role 3: viewer**
   - **Role name**: `viewer`
   - **Description**: `Viewer with read-only access`
   - Click "Save"

## 7. Crear Usuarios de Prueba

### Usuario 1: Admin

1. En el menú lateral, ve a **Users**
2. Click "Add user"
3. Configuración:
   - **Username**: `admin.user`
   - **Email**: `admin@coreticket.com`
   - **First name**: `Admin`
   - **Last name**: `User`
   - ✅ Email verified: ON
   - Click "Create"
4. Ve a la pestaña **Credentials**
   - Click "Set password"
   - **Password**: `admin123`
   - **Password confirmation**: `admin123`
   - ❌ Temporary: OFF
   - Click "Save"
5. Ve a la pestaña **Role mapping**
   - Click "Assign role"
   - Selecciona `admin`
   - Click "Assign"

### Usuario 2: Operator

1. Click "Add user"
2. Configuración:
   - **Username**: `operator.user`
   - **Email**: `operator@coreticket.com`
   - **First name**: `Operator`
   - **Last name**: `User`
   - ✅ Email verified: ON
   - Click "Create"
3. **Credentials**:
   - Password: `operator123`
   - Temporary: OFF
4. **Role mapping**:
   - Assign role: `operator`

### Usuario 3: Viewer

1. Click "Add user"
2. Configuración:
   - **Username**: `viewer.user`
   - **Email**: `viewer@coreticket.com`
   - **First name**: `Viewer`
   - **Last name**: `User`
   - ✅ Email verified: ON
   - Click "Create"
3. **Credentials**:
   - Password: `viewer123`
   - Temporary: OFF
4. **Role mapping**:
   - Assign role: `viewer`

## 8. Configurar Token Settings (Opcional pero Recomendado)

1. Ve a **Realm settings** → **Tokens**
2. Ajusta los siguientes valores:
   - **Access Token Lifespan**: `15 Minutes` (por defecto 5 min)
   - **SSO Session Idle**: `30 Minutes`
   - **SSO Session Max**: `10 Hours`
   - Click "Save"

## 9. Verificar Configuración

### Probar con cURL

```bash
# Obtener token para admin
curl -X POST http://localhost:8080/realms/coreticket-realm/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=coreticket-client" \
  -d "username=admin.user" \
  -d "password=admin123" \
  -d "grant_type=password"
```

Deberías recibir un JSON con `access_token`, `refresh_token`, etc.

### Decodificar el Token

Copia el `access_token` y pégalo en https://jwt.io para ver los claims, incluyendo los roles.

## 10. Exportar Configuración (Opcional)

Para respaldar tu configuración:

```bash
# Desde el contenedor de Keycloak
docker exec -it keycloak /opt/keycloak/bin/kc.sh export --dir /tmp/export --realm coreticket-realm

# Copiar al host
docker cp keycloak:/tmp/export/coreticket-realm.json ./keycloak/realm-export.json
```

## Troubleshooting

### Keycloak no inicia
```bash
# Ver logs
docker-compose logs -f keycloak

# Reiniciar
docker-compose restart keycloak
```

### Error de conexión a PostgreSQL
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres-keycloak

# Verificar logs de PostgreSQL
docker-compose logs postgres-keycloak
```

### Token inválido en las APIs
1. Verifica que el `Authority`, `Issuer` y `Audience` en `appsettings.json` coincidan con Keycloak
2. Asegúrate de que el realm sea `coreticket-realm`
3. Verifica que el token no haya expirado

## Próximos Pasos

Una vez completada la configuración de Keycloak:
1. ✅ Levantar Sistema A (CoreTicket API)
2. ✅ Levantar Sistema B (Payment Service API)
3. ✅ Configurar Angular con Keycloak
4. ✅ Probar autenticación end-to-end
