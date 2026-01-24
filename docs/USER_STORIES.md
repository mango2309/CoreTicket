# Historias de Usuario - CoreTicket

## 📋 Product Backlog

Este documento contiene todas las historias de usuario del proyecto CoreTicket, organizadas por épicas y priorizadas según valor de negocio.

---

## 🎯 Épica 1: Autenticación y Seguridad

### HU-001: Autenticación con Keycloak

**Como** usuario del sistema  
**Quiero** autenticarme usando Keycloak  
**Para** acceder de forma segura a los sistemas A y B

**Criterios de Aceptación:**
- [x] El usuario puede iniciar sesión con username y password
- [x] Se genera un token JWT válido tras autenticación exitosa
- [x] El token expira en 15 minutos
- [x] El usuario puede cerrar sesión y el token se invalida
- [x] Los intentos de login fallidos son registrados
- [x] Después de 5 intentos fallidos, la cuenta se bloquea temporalmente

**Estimación:** 8 Story Points  
**Prioridad:** Alta  
**Sprint:** 1  
**Estado:** ✅ COMPLETADO

**Notas Técnicas:**
- Keycloak 23 como Identity Provider
- Protocolo OpenID Connect (OAuth 2.0)
- JWT Bearer Authentication en ASP.NET Core

---

### HU-002: Control de Acceso Basado en Roles (RBAC)

**Como** administrador del sistema  
**Quiero** asignar roles específicos a los usuarios  
**Para** controlar el acceso a funcionalidades según responsabilidades

**Criterios de Aceptación:**
- [x] Existen 3 roles: admin, operator, viewer
- [x] Los roles se configuran en Keycloak
- [x] Los endpoints del backend validan roles con [Authorize(Roles="...")]
- [x] El frontend muestra/oculta elementos según rol del usuario
- [x] Usuarios sin permisos reciben error 403 Forbidden
- [x] Los roles se incluyen en el token JWT

**Estimación:** 5 Story Points  
**Prioridad:** Alta  
**Sprint:** 1  
**Estado:** ✅ COMPLETADO

**Roles Definidos:**
- **admin:** Acceso completo a todas las funcionalidades
- **operator:** Puede crear, leer y actualizar (no eliminar)
- **viewer:** Solo lectura

---

### HU-003: Single Sign-On (SSO) entre Sistemas

**Como** usuario autenticado  
**Quiero** usar la misma sesión en Sistema A y Sistema B  
**Para** no tener que autenticarme múltiples veces

**Criterios de Aceptación:**
- [x] Un token JWT funciona en ambos sistemas
- [x] La sesión se comparte entre Sistema A y Sistema B
- [x] El logout cierra sesión en ambos sistemas
- [x] El timeout de sesión es consistente (30 min)
- [x] Ambos sistemas usan el mismo realm de Keycloak
- [x] El usuario ve su información en ambos sistemas

**Estimación:** 8 Story Points  
**Prioridad:** Alta  
**Sprint:** 2  
**Estado:** ✅ COMPLETADO

**Configuración:**
- Realm compartido: `coreticket-realm`
- Cliente A: `coreticket-client` (público)
- Cliente B: `payment-client` (confidencial)

---

### HU-004: Autenticación de Dos Factores (2FA)

**Como** usuario del sistema  
**Quiero** habilitar autenticación de dos factores con una app móvil  
**Para** aumentar la seguridad de mi cuenta

**Criterios de Aceptación:**
- [x] El usuario puede habilitar 2FA desde su perfil
- [x] Se genera un código QR para configurar la app móvil
- [x] El sistema valida el código TOTP de 6 dígitos al login
- [x] El usuario puede deshabilitar 2FA si lo desea
- [x] Se generan códigos de recuperación por si pierde el dispositivo
- [x] Compatible con Google Authenticator, Microsoft Authenticator, Authy

**Estimación:** 13 Story Points  
**Prioridad:** Media  
**Sprint:** 3  
**Estado:** ✅ COMPLETADO

**Implementación:**
- TOTP (Time-based One-Time Password)
- Algoritmo: SHA256
- Período: 30 segundos
- Dígitos: 6

---

### HU-005: Federación de Usuarios

**Como** administrador del sistema  
**Quiero** permitir que los usuarios se autentiquen con Google o Microsoft  
**Para** facilitar el acceso sin crear cuentas locales

**Criterios de Aceptación:**
- [x] Los usuarios pueden hacer login con Google
- [x] Los usuarios pueden hacer login con Microsoft/Azure AD
- [x] Las identidades externas se vinculan a cuentas locales
- [x] Los usuarios pueden vincular múltiples identidades
- [x] La información del perfil se sincroniza automáticamente
- [x] Los usuarios federados tienen los mismos roles que usuarios locales

**Estimación:** 13 Story Points  
**Prioridad:** Media  
**Sprint:** 3  
**Estado:** ✅ COMPLETADO

**Proveedores Configurados:**
- Google Identity Platform
- Microsoft Azure AD
- Base de datos local de Keycloak

---

## 🎯 Épica 2: Comunicación Segura

### HU-006: Encriptación de Datos con KMS

**Como** Sistema A  
**Quiero** encriptar datos sensibles antes de enviarlos  
**Para** proteger información confidencial en tránsito

**Criterios de Aceptación:**
- [x] Sistema A puede encriptar datos usando HashiCorp Vault
- [x] Se utiliza el Transit Engine de Vault
- [x] La encriptación usa AES-256-GCM
- [x] Las claves nunca salen de Vault
- [x] Se registra auditoría de todas las operaciones de encriptación
- [x] El sistema maneja errores de Vault gracefully

**Estimación:** 8 Story Points  
**Prioridad:** Alta  
**Sprint:** 4  
**Estado:** ✅ COMPLETADO

**Configuración:**
- Vault Address: http://localhost:8200
- Transit Key: `coreticket-key`
- Algoritmo: AES-256-GCM

---

### HU-007: Desencriptación de Datos en Sistema B

**Como** Sistema B  
**Quiero** desencriptar datos recibidos desde Sistema A  
**Para** procesar información de forma segura

**Criterios de Aceptación:**
- [x] Sistema B puede desencriptar datos usando Vault
- [x] Solo puede desencriptar datos encriptados con la clave correcta
- [x] Se valida la integridad de los datos desencriptados
- [x] Se registra auditoría de todas las desencriptaciones
- [x] El sistema rechaza datos manipulados o corruptos
- [x] Maneja errores de desencriptación apropiadamente

**Estimación:** 5 Story Points  
**Prioridad:** Alta  
**Sprint:** 4  
**Estado:** ✅ COMPLETADO

---

### HU-008: Comunicación Encriptada A→B

**Como** Sistema A  
**Quiero** enviar datos encriptados al Sistema B  
**Para** garantizar confidencialidad end-to-end

**Criterios de Aceptación:**
- [x] Sistema A encripta payload antes de enviar
- [x] La comunicación usa HTTPS en producción
- [x] Se incluye autenticación JWT en la petición
- [x] Sistema B desencripta y procesa el payload
- [x] Se retorna confirmación de procesamiento exitoso
- [x] Todo el flujo está documentado y probado

**Estimación:** 13 Story Points  
**Prioridad:** Alta  
**Sprint:** 4  
**Estado:** ✅ COMPLETADO

**Flujo:**
1. Sistema A: Encripta datos con Vault
2. Sistema A: Envía HTTP POST a Sistema B
3. Sistema B: Valida JWT
4. Sistema B: Desencripta con Vault
5. Sistema B: Procesa y responde

---

## 🎯 Épica 3: Funcionalidades de Negocio

### HU-009: Gestión de Tickets de Estacionamiento

**Como** operador  
**Quiero** crear y gestionar tickets de estacionamiento  
**Para** controlar el acceso al estacionamiento

**Criterios de Aceptación:**
- [x] Puedo crear un nuevo ticket con placa y hora de entrada
- [x] Puedo consultar tickets activos
- [x] Puedo calcular el monto a pagar según horas
- [x] Puedo marcar un ticket como pagado
- [x] Solo usuarios con rol operator o admin pueden crear tickets
- [x] Los viewers solo pueden consultar

**Estimación:** 8 Story Points  
**Prioridad:** Alta  
**Sprint:** 1  
**Estado:** ✅ COMPLETADO

---

### HU-010: Sistema de Puntos de Lealtad

**Como** usuario frecuente  
**Quiero** acumular puntos por cada visita  
**Para** obtener descuentos en futuras visitas

**Criterios de Aceptación:**
- [x] Se acumulan puntos automáticamente al pagar
- [x] Puedo consultar mi saldo de puntos
- [x] Puedo canjear puntos por descuentos
- [x] Los puntos tienen fecha de expiración
- [x] Se registra historial de acumulación y canje
- [x] Solo usuarios autenticados tienen puntos

**Estimación:** 13 Story Points  
**Prioridad:** Media  
**Sprint:** 2  
**Estado:** ✅ COMPLETADO

---

### HU-011: Procesamiento de Pagos

**Como** Sistema B (Payment Service)  
**Quiero** procesar pagos de forma segura  
**Para** registrar transacciones correctamente

**Criterios de Aceptación:**
- [x] Puedo recibir solicitudes de pago
- [x] Valido autenticación JWT del solicitante
- [x] Proceso pagos encriptados desde Sistema A
- [x] Registro cada transacción con timestamp
- [x] Retorno confirmación de pago procesado
- [x] Manejo errores de procesamiento

**Estimación:** 8 Story Points  
**Prioridad:** Alta  
**Sprint:** 4  
**Estado:** ✅ COMPLETADO

---

## 🎯 Épica 4: Calidad y Monitoreo

### HU-012: Análisis Estático de Código

**Como** desarrollador  
**Quiero** analizar el código con SonarQube  
**Para** identificar vulnerabilidades y code smells

**Criterios de Aceptación:**
- [x] SonarQube está configurado y corriendo
- [x] El código se analiza automáticamente
- [x] Se identifican vulnerabilidades de seguridad
- [x] Se miden métricas de calidad (coverage, duplicación)
- [x] Se genera reporte de análisis
- [x] Se documentan hallazgos y remediaciones

**Estimación:** 5 Story Points  
**Prioridad:** Media  
**Sprint:** 5  
**Estado:** ✅ COMPLETADO

---

### HU-013: Auditoría de Eventos

**Como** administrador  
**Quiero** ver logs de eventos de seguridad  
**Para** detectar actividades sospechosas

**Criterios de Aceptación:**
- [x] Todos los logins se registran en Keycloak
- [x] Las operaciones de encriptación se auditan en Vault
- [x] Los accesos a endpoints protegidos se loggean
- [x] Puedo filtrar eventos por usuario, fecha, tipo
- [x] Los logs se retienen por al menos 30 días
- [x] Se alertan eventos sospechosos

**Estimación:** 8 Story Points  
**Prioridad:** Media  
**Sprint:** 5  
**Estado:** ✅ COMPLETADO

---

## 📊 Resumen de Estimaciones

| Épica | Total Story Points | Historias | Estado |
|-------|-------------------|-----------|--------|
| Autenticación y Seguridad | 47 SP | 5 | ✅ 100% |
| Comunicación Segura | 26 SP | 3 | ✅ 100% |
| Funcionalidades de Negocio | 29 SP | 3 | ✅ 100% |
| Calidad y Monitoreo | 13 SP | 2 | ✅ 100% |
| **TOTAL** | **115 SP** | **13** | **✅ 100%** |

---

## 🎯 Definición de "Done"

Una historia se considera "Done" cuando:

- [x] Código implementado y revisado (code review)
- [x] Tests unitarios escritos y pasando
- [x] Tests de integración pasando
- [x] Documentación actualizada
- [x] Desplegado en ambiente de desarrollo
- [x] Aceptado por el Product Owner
- [x] Sin bugs críticos pendientes

---

## 📈 Velocity por Sprint

| Sprint | Planificado | Completado | Velocity |
|--------|-------------|------------|----------|
| Sprint 1 | 21 SP | 21 SP | 100% |
| Sprint 2 | 26 SP | 26 SP | 100% |
| Sprint 3 | 26 SP | 26 SP | 100% |
| Sprint 4 | 26 SP | 26 SP | 100% |
| Sprint 5 | 16 SP | 16 SP | 100% |
| **Total** | **115 SP** | **115 SP** | **100%** |

**Velocity Promedio:** 23 SP por sprint

---

**Última Actualización:** Enero 2026  
**Equipo:** CoreTicket Development Team  
**Product Owner:** [Nombre]  
**Scrum Master:** [Nombre]
