# Checklist de Preparación para la Presentación

## ✅ Antes de la Presentación (30 minutos antes)

### 1. Verificar Infraestructura
- [ ] Docker Desktop está corriendo
- [ ] Ejecutar: `docker-compose up -d`
- [ ] Verificar: `docker-compose ps` (todos los servicios "Up")
- [ ] Esperar 2 minutos para que Keycloak inicie completamente

### 2. Iniciar Backends
- [ ] Abrir Terminal 1: `cd backend\TicketParkingAPI\TicketParkingAPI && dotnet run`
- [ ] Abrir Terminal 2: `cd backend\PaymentServiceAPI && dotnet run`
- [ ] Verificar logs: "Now listening on: http://localhost:5000" y "5001"

### 3. Verificar Keycloak
- [ ] Abrir http://localhost:8080 en el navegador
- [ ] Login: admin / admin
- [ ] Verificar que el realm "coreticket-realm" existe
- [ ] Verificar que los usuarios existen (admin.user, operator.user, viewer.user)
- [ ] Verificar que los roles existen (admin, operator, viewer)

### 4. Preparar Navegador
- [ ] Abrir pestañas:
  - http://localhost:8080 (Keycloak)
  - http://localhost:5000/swagger (Sistema A)
  - http://localhost:5001/swagger (Sistema B)
  - https://jwt.io (para mostrar token)

### 5. Preparar Scripts
- [ ] Tener PowerShell abierto en la raíz del proyecto
- [ ] Tener `demo-presentation.ps1` listo para ejecutar
- [ ] Tener comandos de respaldo en un archivo .txt

### 6. Prueba Rápida (5 minutos antes)
- [ ] Ejecutar: `.\demo-presentation.ps1`
- [ ] Verificar que todo funciona
- [ ] Si algo falla, reiniciar servicios

---

## 🎬 Durante la Presentación

### Orden Recomendado (15-20 minutos)

1. **Introducción (2 min)**
   - Explicar el objetivo del proyecto
   - Mostrar diagrama de arquitectura
   - Mencionar tecnologías usadas

2. **Mostrar Keycloak (3 min)**
   - Acceder a la consola de administración
   - Mostrar realm, usuarios, roles, clientes
   - Explicar el concepto de SSO

3. **Ejecutar Script Automatizado (5 min)**
   - Ejecutar: `.\demo-presentation.ps1`
   - Pausar en cada sección para explicar
   - Mostrar tokens, respuestas, errores esperados

4. **Demostración Manual en Swagger (5 min)**
   - Mostrar endpoint sin token (401)
   - Obtener token
   - Autorizar en Swagger
   - Probar endpoint con token (200)
   - Usar mismo token en Sistema B (SSO)

5. **Mostrar Token en jwt.io (2 min)**
   - Copiar token
   - Pegar en jwt.io
   - Explicar payload (usuario, roles, expiración)

6. **Conclusión (3 min)**
   - Resumen de logros
   - Puntos obtenidos (32/100)
   - Próximos pasos
   - Preguntas

---

## 🐛 Plan de Contingencia

### Si Keycloak no responde:
```powershell
docker-compose restart keycloak
# Esperar 1 minuto
```

### Si las APIs no responden:
```powershell
# En cada terminal, presionar Ctrl+C
dotnet run
```

### Si el token expira durante la demo:
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8080/realms/coreticket-realm/protocol/openid-connect/token" -Method Post -Body @{client_id="coreticket-client";username="admin.user";password="admin123";grant_type="password"} -ContentType "application/x-www-form-urlencoded"
$token = $response.access_token
```

### Si algo falla completamente:
- Tener capturas de pantalla de respaldo
- Tener el video de la demostración grabado previamente
- Explicar verbalmente el flujo usando el diagrama

---

## 📝 Comandos de Respaldo (Copiar/Pegar Rápido)

### Obtener token de admin:
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8080/realms/coreticket-realm/protocol/openid-connect/token" -Method Post -Body @{client_id="coreticket-client";username="admin.user";password="admin123";grant_type="password"} -ContentType "application/x-www-form-urlencoded"; $token = $response.access_token; Write-Host $token
```

### Probar Sistema B con token:
```powershell
$headers = @{Authorization="Bearer $token"}; Invoke-RestMethod -Uri "http://localhost:5001/api/payment/123e4567-e89b-12d3-a456-426614174000" -Method Get -Headers $headers
```

### Probar Sistema A con mismo token:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/tickets" -Method Get -Headers $headers
```

---

## 🎯 Puntos Clave a Enfatizar

1. **Seguridad**: Todos los endpoints están protegidos
2. **SSO**: Un solo login para múltiples sistemas
3. **Escalabilidad**: Fácil agregar más sistemas
4. **Estándares**: OAuth 2.0, OpenID Connect, JWT
5. **Producción-ready**: Keycloak usado por empresas Fortune 500

---

## ⏰ Timing Sugerido

| Sección | Tiempo | Acumulado |
|---------|--------|-----------|
| Introducción | 2 min | 2 min |
| Keycloak | 3 min | 5 min |
| Script automatizado | 5 min | 10 min |
| Swagger UI | 5 min | 15 min |
| jwt.io | 2 min | 17 min |
| Conclusión | 3 min | 20 min |
| **TOTAL** | **20 min** | |

---

## 📊 Métricas a Mencionar

- **Sistemas implementados**: 2 (CoreTicket + Payment Service)
- **Usuarios de prueba**: 3 (admin, operator, viewer)
- **Roles definidos**: 3 (con permisos diferenciados)
- **Endpoints protegidos**: 100%
- **Tiempo de respuesta**: < 100ms
- **Puntos obtenidos**: 32/100 (Sprint 1 completo)
- **Tecnologías**: 6 (Keycloak, .NET, PostgreSQL, Docker, Vault, Angular)

---

## ✅ Checklist Final (5 minutos antes)

- [ ] Todos los servicios corriendo
- [ ] Navegador con pestañas abiertas
- [ ] PowerShell en la raíz del proyecto
- [ ] Script de demo probado
- [ ] Comandos de respaldo listos
- [ ] Agua/café preparado
- [ ] Respirar profundo 😊

¡ÉXITO EN TU PRESENTACIÓN! 🎉
