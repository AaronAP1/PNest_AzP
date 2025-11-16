# Arquitectura de Microservicios - Sistema PPP

## 🏗️ Visión General

El sistema PPP está distribuido en **4 microservicios independientes** + **1 API Gateway**:

```
┌─────────────────────────────────────────────────────────────┐
│                     ppaz-api-gateway                         │
│                       Puerto: 3000                           │
│              (Enrutamiento y comunicación HTTP)              │
└────┬────────────┬────────────┬────────────┬─────────────────┘
     │            │            │            │
     ▼            ▼            ▼            ▼
┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────────┐
│  AUTH   │ │ ACADEMIC │ │  CORE   │ │ EVALUACIONES │
│ Service │ │ Service  │ │ Service │ │   Service    │
│  :3001  │ │  :3002   │ │  :3003  │ │    :3004     │
└────┬────┘ └────┬─────┘ └────┬────┘ └──────┬───────┘
     │           │            │              │
     ▼           ▼            ▼              ▼
┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────────┐
│ auth_db │ │academic  │ │ core_db │ │evaluaciones  │
│         │ │    _db   │ │         │ │     _db      │
└─────────┘ └──────────┘ └─────────┘ └──────────────┘
```

---

## 📊 Distribución de Tablas por Microservicio

### 1️⃣ **ppp-auth-service** (Puerto 3001)
**Base de datos:** `ppp_auth_db`

| Tabla | Descripción |
|-------|-------------|
| `usuario` | Usuarios del sistema (alumnos, secretarias, supervisores, coordinadores) |
| `rol` | Roles disponibles (ALUMNO, SECRETARIA, SUPERVISOR, COORDINADOR, ADMIN) |
| `usuario_rol` | Relación many-to-many entre usuarios y roles |

**Responsabilidades:**
- Autenticación (login, logout, refresh token)
- Autorización (validación de roles y permisos)
- Gestión de usuarios (CRUD)
- Hash de contraseñas con bcrypt
- Generación y validación de JWT

---

### 2️⃣ **ppp_core → ppp-academic-service** (Puerto 3002)
**Base de datos:** `ppp_academic_db`

| Tabla | Descripción |
|-------|-------------|
| `facultad` | Facultades de la universidad |
| `escuela` | Escuelas profesionales por facultad |
| `alumno` | Estudiantes (referencia a usuario_id) |
| `secretaria` | Personal de secretaría (referencia a usuario_id) |
| `supervisor` | Supervisores académicos (referencia a usuario_id) |
| `coordinador` | Coordinadores de PPP (referencia a usuario_id) |
| `linea_facultad` | Líneas de investigación/práctica por escuela |

**Responsabilidades:**
- Gestión de estructura académica (facultades y escuelas)
- Registro y gestión de alumnos
- Asignación de personal académico (secretarias, supervisores, coordinadores)
- Gestión de líneas de práctica por facultad

**Relaciones externas:**
- `alumno.usuarioId` → AUTH Service
- `secretaria.usuarioId` → AUTH Service
- `supervisor.usuarioId` → AUTH Service  
- `coordinador.usuarioId` → AUTH Service

---

### 3️⃣ **ppp_compañias → ppp-core-service** (Puerto 3003)
**Base de datos:** `ppp_core_db`

| Tabla | Descripción |
|-------|-------------|
| `empresa` | Empresas donde se realizan las prácticas |
| `solicitud_ppp` | Solicitudes de práctica pre-profesional |
| `carta_presentacion` | Cartas de presentación emitidas |
| `reuniones` | Reuniones relacionadas a solicitudes |
| `tipo_documento` | Tipos de documentos del sistema |
| `documento` | Documentos asociados a solicitudes |

**Responsabilidades:**
- Gestión de empresas y convenios
- Creación y seguimiento de solicitudes PPP
- Generación de cartas de presentación
- Gestión de documentos (PDFs, contratos, informes)
- Agendamiento de reuniones

**Relaciones externas:**
- `solicitud_ppp.idSupervisor` → ACADEMIC Service
- `solicitud_ppp.idAlumno` → ACADEMIC Service
- `carta_presentacion.idAlumno` → ACADEMIC Service
- `carta_presentacion.idSecretaria` → ACADEMIC Service

---

### 4️⃣ **ppp-evaluaciones-service** (Puerto 3004)
**Base de datos:** `ppp_evaluaciones_db`

| Tabla | Descripción |
|-------|-------------|
| `evaluacion_supervisor` | Evaluaciones del supervisor al alumno |
| `evaluacion_preguntas` | Respuestas de evaluación del supervisor |
| `preguntas` | Banco de preguntas para evaluación supervisor |
| `evaluacion_practicante` | Auto-evaluación del practicante |
| `evaluacion_practicante_solicitud` | Respuestas de dimensiones transversales |
| `preguntas_linea` | Preguntas específicas por línea de facultad |
| `dimension_transversal` | Competencias transversales a evaluar |

**Responsabilidades:**
- Evaluación de supervisores a practicantes
- Auto-evaluación de practicantes
- Gestión de banco de preguntas
- Evaluación de competencias transversales
- Reportes de desempeño

**Relaciones externas:**
- `evaluacion_supervisor.idSupervisor` → ACADEMIC Service
- `evaluacion_supervisor.idAlumno` → ACADEMIC Service
- `evaluacion_practicante.idSolicitud` → CORE Service
- `preguntas_linea.idLineaFacultad` → ACADEMIC Service

---

### 5️⃣ **ppaz-api-gateway** (Puerto 3000)
**Sin base de datos propia**

**Responsabilidades:**
- Enrutamiento de peticiones HTTP a microservicios
- Validación de JWT (coordina con AUTH Service)
- Consolidación de respuestas de múltiples servicios
- Rate limiting y throttling
- Logging centralizado

---

## 🔄 Flujo de Comunicación

### Ejemplo: Crear solicitud PPP

```
1. Cliente → Gateway
   POST /api/solicitudes
   Headers: { Authorization: "Bearer <token>" }

2. Gateway → AUTH Service
   MessagePattern: "auth.validateToken"
   Respuesta: { userId, roles }

3. Gateway → ACADEMIC Service
   MessagePattern: "alumnos.findByUsuarioId"
   Respuesta: { id, codigo, escuela }

4. Gateway → CORE Service
   MessagePattern: "solicitudes.create"
   Body: { idAlumno, idSupervisor, ... }
   Respuesta: { id, estado, createdAt }

5. Gateway → Cliente
   HTTP 201 Created
   Body: { solicitud creada }
```

---

## 🔐 Seguridad

### Autenticación
- JWT (JSON Web Tokens)
- Tokens con expiración de 24h
- Refresh tokens de 7 días

### Comunicación entre servicios
- TCP (Transport.TCP en NestJS)
- Mensajes asincrónicos con `@MessagePattern()`
- Sin exposición HTTP directa de microservicios

### Variables de entorno
```env
# Auth Service
DATABASE_URL_AUTH="postgresql://..."
JWT_SECRET="..."
JWT_EXPIRATION="24h"

# Academic Service
DATABASE_URL_ACADEMIC="postgresql://..."

# Core Service
DATABASE_URL_CORE="postgresql://..."

# Evaluaciones Service
DATABASE_URL_EVALUACIONES="postgresql://..."

# Gateway
PORT=3000
AUTH_SERVICE_HOST=localhost
AUTH_SERVICE_PORT=3001
ACADEMIC_SERVICE_HOST=localhost
ACADEMIC_SERVICE_PORT=3002
CORE_SERVICE_HOST=localhost
CORE_SERVICE_PORT=3003
EVALUACIONES_SERVICE_HOST=localhost
EVALUACIONES_SERVICE_PORT=3004
```

---

## 📦 Deployment en Azure

### Recursos necesarios
1. **Azure PostgreSQL Flexible Server**
   - 4 bases de datos:
     - `ppp_auth_db`
     - `ppp_academic_db`
     - `ppp_core_db`
     - `ppp_evaluaciones_db`

2. **Azure Container Registry** (ACR)
   - Imágenes Docker de los 5 servicios

3. **Azure Container Instances** (ACI) o **Azure App Service**
   - 5 instancias (1 por servicio)
   - Configuración de variables de entorno
   - Networking entre servicios

4. **Azure Key Vault** (Recomendado)
   - Almacenamiento seguro de secrets
   - Connection strings
   - JWT secrets

---

## 🚀 Scripts de Deployment

### Crear bases de datos
```powershell
.\scripts\create-azure-databases.ps1 `
    -ServerName "ppp-postgres-server" `
    -AdminUser "pppAdmin" `
    -AdminPassword "SecurePassword123!" `
    -ResourceGroup "ppp-resources"
```

### Generar migraciones
```powershell
# Auth
npx prisma migrate deploy --schema=./apps/ppp-auth-service/prisma/schema.prisma

# Academic  
npx prisma migrate deploy --schema=./prisma/schema.prisma

# Core
npx prisma migrate deploy --schema=./apps/ppp_compañias/prisma/schema.prisma

# Evaluaciones
npx prisma migrate deploy --schema=./apps/ppp-evaluaciones-service/prisma/schema.prisma
```

---

## 📈 Monitoreo

### Health Checks
Cada microservicio expone un endpoint de salud:
```
GET /health
Response: { status: "ok", service: "ppp-auth-service", timestamp: "..." }
```

### Logs
- Console.log centralizado en Gateway
- Azure Application Insights (recomendado)

---

## 🔄 Versionado de APIs

Usar prefijos de versión en el Gateway:
```
/api/v1/usuarios
/api/v1/solicitudes
/api/v1/evaluaciones
```

---

## 📚 Documentación de APIs

- Swagger/OpenAPI en cada microservicio
- Accesible vía Gateway en `/api/docs`

---

## 🎯 Próximos Pasos

1. ✅ Completar CRUDs restantes (ver GUIA_GENERAR_CRUDS.md)
2. ✅ Aplicar migraciones en Azure
3. ✅ Configurar Gateway para enrutar a los 4 servicios
4. ⏳ Implementar autenticación JWT
5. ⏳ Dockerizar todos los servicios
6. ⏳ Configurar CI/CD con GitHub Actions
7. ⏳ Deploy en Azure Container Instances
