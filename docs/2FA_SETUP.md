# Configuración de 2FA (Two-Factor Authentication) con Keycloak

## 🎯 Objetivo
Implementar autenticación de doble factor usando TOTP (Time-based One-Time Password) con Keycloak, compatible con aplicaciones móviles como Google Authenticator, Microsoft Authenticator, o Authy.

---

## 📱 Paso 1: Configurar OTP en Keycloak

### 1.1 Acceder a la Consola de Administración
1. Navega a: http://localhost:8080
2. Login: `admin` / `admin`
3. Selecciona el realm: `coreticket-realm`

### 1.2 Configurar Política de OTP
1. Ve a **Authentication** → **Policies** → **OTP Policy**
2. Configura los siguientes valores:

```yaml
OTP Type: Time-Based
OTP Hash Algorithm: SHA256
Number of Digits: 6
Look Ahead Window: 1
OTP Token Period: 30 segundos
Supported Applications: FreeOTP, Google Authenticator
```

3. Click **Save**

### 1.3 Configurar Flujo de Autenticación
1. Ve a **Authentication** → **Flows**
2. Selecciona **Browser** flow
3. Click **Duplicate** para crear una copia
4. Nombra el nuevo flow: `Browser with OTP`
5. Configura el flujo:

```
Browser with OTP
├── Cookie (ALTERNATIVE)
├── Identity Provider Redirector (ALTERNATIVE)
└── Forms (ALTERNATIVE)
    ├── Username Password Form (REQUIRED)
    └── OTP Form (REQUIRED)  ← Cambiar de OPTIONAL a REQUIRED
```

6. En **OTP Form**, click en **Actions** → **Config**
7. Marca: **User Attribute Name**: `otp_secret`
8. Click **Save**

### 1.4 Asignar el Flujo al Realm
1. Ve a **Authentication** → **Bindings**
2. En **Browser Flow**, selecciona: `Browser with OTP`
3. Click **Save**

---

## 👤 Paso 2: Configurar 2FA para Usuarios

### 2.1 Configurar 2FA para Usuario Admin
1. Ve a **Users** → Busca `admin.user`
2. Click en el usuario
3. Ve a la pestaña **Credentials**
4. En la sección **Credential Reset**, selecciona:
   - ✅ **Configure OTP**
5. Click **Reset Actions**
6. Marca: **Send Email** (opcional)
7. Click **Send Email** o copia el link de configuración

### 2.2 Configurar desde la Cuenta del Usuario
1. Logout de la consola de admin
2. Navega a: http://localhost:8080/realms/coreticket-realm/account
3. Login con: `admin.user` / `admin123`
4. Ve a **Account Security** → **Signing In**
5. Click en **Set up Authenticator application**
6. Escanea el código QR con tu app móvil (Google Authenticator, Authy, etc.)
7. Ingresa el código de 6 dígitos generado
8. Click **Submit**

### 2.3 Códigos de Recuperación (Opcional pero Recomendado)
1. En la misma página, ve a **Recovery Codes**
2. Click **Generate new recovery codes**
3. Guarda los códigos en un lugar seguro
4. Estos códigos permiten acceder si pierdes tu dispositivo móvil

---

## 🧪 Paso 3: Probar 2FA

### 3.1 Probar en el Frontend
1. Navega a: http://localhost:4200
2. Click en **Login**
3. Ingresa credenciales: `admin.user` / `admin123`
4. Keycloak solicitará el código OTP
5. Abre tu app móvil (Google Authenticator)
6. Ingresa el código de 6 dígitos
7. Deberías ser redirigido al dashboard

### 3.2 Probar con cURL (Flujo Directo)
```bash
# Nota: El flujo de password grant no soporta 2FA directamente
# Debes usar el flujo de Authorization Code con PKCE

# 1. Obtener código de autorización (navegador)
http://localhost:8080/realms/coreticket-realm/protocol/openid-connect/auth?client_id=coreticket-client&redirect_uri=http://localhost:4200/callback&response_type=code&scope=openid

# 2. Después del login y 2FA, intercambiar código por token
curl -X POST http://localhost:8080/realms/coreticket-realm/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=coreticket-client" \
  -d "grant_type=authorization_code" \
  -d "code=<CODIGO_OBTENIDO>" \
  -d "redirect_uri=http://localhost:4200/callback"
```

---

## 🔧 Paso 4: Configurar 2FA Opcional (Recomendado)

Si quieres que 2FA sea opcional y no obligatorio:

1. Ve a **Authentication** → **Flows** → `Browser with OTP`
2. En **OTP Form**, cambia de **REQUIRED** a **CONDITIONAL**
3. Añade una subcondición:
   - Click **Add step** bajo OTP Form
   - Selecciona **Condition - User Configured**
   - Marca como **REQUIRED**

Esto permite que:
- Usuarios que configuraron 2FA → deben usarlo
- Usuarios que no configuraron 2FA → pueden entrar sin él

---

## 📊 Paso 5: Verificar Configuración

### 5.1 Verificar en Keycloak Admin
1. Ve a **Realm Settings** → **Sessions**
2. Deberías ver sesiones activas con 2FA
3. Ve a **Events** → **Login Events**
4. Verifica eventos de tipo: `LOGIN`, `VERIFY_TOTP`

### 5.2 Verificar en el Token JWT
Decodifica el token en https://jwt.io y verifica el claim:
```json
{
  "acr": "1",  // Authentication Context Class Reference
  "amr": ["pwd", "otp"],  // Authentication Methods References
  ...
}
```

---

## 🔐 Paso 6: Configurar 2FA para Todos los Usuarios

### Script PowerShell para Configurar 2FA en Masa
```powershell
# setup-2fa-users.ps1
$KEYCLOAK_URL = "http://localhost:8080"
$REALM = "coreticket-realm"
$ADMIN_USER = "admin"
$ADMIN_PASS = "admin"

# Obtener token de admin
$tokenUrl = "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token"
$body = @{
    client_id = "admin-cli"
    username = $ADMIN_USER
    password = $ADMIN_PASS
    grant_type = "password"
}

$response = Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $body
$adminToken = $response.access_token

# Listar usuarios
$usersUrl = "$KEYCLOAK_URL/admin/realms/$REALM/users"
$headers = @{
    Authorization = "Bearer $adminToken"
}

$users = Invoke-RestMethod -Uri $usersUrl -Method Get -Headers $headers

# Configurar acción de OTP para cada usuario
foreach ($user in $users) {
    Write-Host "Configurando 2FA para: $($user.username)"
    
    $actionsUrl = "$KEYCLOAK_URL/admin/realms/$REALM/users/$($user.id)/execute-actions-email"
    $actions = @("CONFIGURE_TOTP")
    
    Invoke-RestMethod -Uri $actionsUrl -Method Put -Headers $headers -Body ($actions | ConvertTo-Json) -ContentType "application/json"
}

Write-Host "✅ 2FA configurado para todos los usuarios"
```

---

## 📱 Apps Móviles Recomendadas

### Google Authenticator
- **iOS:** https://apps.apple.com/app/google-authenticator/id388497605
- **Android:** https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2

### Microsoft Authenticator
- **iOS:** https://apps.apple.com/app/microsoft-authenticator/id983156458
- **Android:** https://play.google.com/store/apps/details?id=com.azure.authenticator

### Authy
- **iOS:** https://apps.apple.com/app/authy/id494168017
- **Android:** https://play.google.com/store/apps/details?id=com.authy.authy

---

## 🛡️ Mejores Prácticas

1. **Códigos de Recuperación:** Siempre genera y guarda códigos de recuperación
2. **Backup:** Usa apps que permitan backup en la nube (Microsoft Authenticator, Authy)
3. **Múltiples Dispositivos:** Configura 2FA en más de un dispositivo
4. **Educación:** Capacita a los usuarios sobre la importancia de 2FA
5. **Monitoreo:** Revisa eventos de login fallidos por OTP incorrecto

---

## 🔍 Troubleshooting

### Problema: "Invalid authenticator code"
**Solución:**
1. Verifica que la hora del servidor y del móvil estén sincronizadas
2. En Google Authenticator: Settings → Time correction for codes → Sync now
3. Verifica que el código no haya expirado (30 segundos)

### Problema: "OTP not configured"
**Solución:**
1. El usuario debe configurar OTP primero
2. Ve a: http://localhost:8080/realms/coreticket-realm/account
3. Configura el authenticator

### Problema: Perdí mi dispositivo móvil
**Solución:**
1. Usa un código de recuperación
2. O contacta al administrador para resetear OTP:
   - Keycloak Admin → Users → [usuario] → Credentials
   - Click en **Delete** en la credencial OTP

---

## ✅ Verificación Final

- [ ] OTP Policy configurada en Keycloak
- [ ] Flujo de autenticación con OTP habilitado
- [ ] Al menos un usuario tiene 2FA configurado
- [ ] Login con 2FA funciona en el frontend
- [ ] Códigos de recuperación generados
- [ ] Eventos de login con OTP registrados en Keycloak

---

## 📊 Impacto en Seguridad

**Antes de 2FA:**
- Seguridad basada solo en contraseña
- Vulnerable a phishing, keyloggers, credential stuffing

**Después de 2FA:**
- ✅ Protección contra robo de contraseñas
- ✅ Protección contra ataques de fuerza bruta
- ✅ Cumplimiento con estándares de seguridad (PCI DSS, HIPAA)
- ✅ Reducción del 99.9% de ataques automatizados (según Google)

---

**Fecha de Implementación:** Sprint 3  
**Responsable:** Equipo CoreTicket  
**Estado:** ✅ IMPLEMENTADO
