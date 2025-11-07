# 🚀 Sistema de Prácticas Pre-Profesionales (PPP)
## Arquitectura de Microservicios con NestJS

---

## 📋 Tabla de Contenidos
- [Descripción](#descripción)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Configuración Local](#configuración-local)
- [Health Checks](#health-checks)
- [Despliegue en Azure](#despliegue-en-azure)
- [API Documentation](#api-documentation)

---

## 📝 Descripción

Sistema de gestión de prácticas pre-profesionales implementado con arquitectura de microservicios utilizando NestJS, Prisma ORM y Azure PostgreSQL.

---

## 🏗️ Arquitectura

### Servicios

1. **API Gateway** (Puerto 3000)
   - Punto de entrada único para todas las peticiones HTTP
   - Documentación Swagger en `/api/docs`
   - Rate limiting y validación
   - Health checks en `/health`

2. **ppp_core** (Puerto 3001)
   - Microservicio TCP
   - Gestión del dominio académico
   - Base de datos: `pppNest_Core`
   - Módulos:
     - Usuarios
     - Roles
     - Facultades
     - Escuelas
     - Secretarías
     - Alumnos

3. **ppp_compañías** (Puerto 3002)
   - Microservicio TCP
   - Gestión del dominio empresarial
   - Base de datos: `pppNest_Companias`
   - Módulos:
     - Empresas
     - Tipo Documentos
     - Documentos
     - Cartas de Presentación

### Patrón de Comunicación

```
Cliente HTTP → API Gateway (HTTP) → Microservices (TCP) → PostgreSQL (Azure)
```

---

## 🛠️ Tecnologías

- **NestJS** v11.0.1 - Framework de microservicios
- **Prisma ORM** v6.19.0 - Database ORM
- **PostgreSQL** - Azure Flexible Server
- **TypeScript** v5.7.3
- **Swagger/OpenAPI** - Documentación de API
- **@nestjs/terminus** - Health Checks
- **@nestjs/config** - Gestión de configuración
- **Joi** - Validación de variables de entorno

---

## ⚙️ Configuración Local

### 1. Prerrequisitos

```bash
# Node.js 18+ y npm
node --version
npm --version

# PostgreSQL (Azure o local)
```

### 2. Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd PNest_AzP

# Instalar dependencias
npm install
```

### 3. Variables de Entorno

Crear archivos `.env` en cada aplicación:

#### `apps/ppp_core/.env`
```env
DATABASE_URL_CORE="postgresql://USER:PASSWORD@HOST:5432/pppNest_Core?schema=public&sslmode=require"
APP_NAME="ppp_core"
PORT=3001
HOST="localhost"
NODE_ENV="development"
LOG_LEVEL="debug"
```

#### `apps/ppp_compañias/.env`
```env
DATABASE_URL_COMPANIAS="postgresql://USER:PASSWORD@HOST:5432/pppNest_Companias?schema=public&sslmode=require"
APP_NAME="ppp_companias"
PORT=3002
HOST="localhost"
NODE_ENV="development"
LOG_LEVEL="debug"
```

#### `apps/ppaz-api-gateway/.env`
```env
APP_NAME="ppaz_api_gateway"
PORT=3000
HOST="localhost"
PPP_CORE_HOST="localhost"
PPP_CORE_PORT=3001
PPP_COMPANIAS_HOST="localhost"
PPP_COMPANIAS_PORT=3002
DATABASE_URL_CORE="postgresql://USER:PASSWORD@HOST:5432/pppNest_Core?schema=public&sslmode=require"
DATABASE_URL_COMPANIAS="postgresql://USER:PASSWORD@HOST:5432/pppNest_Companias?schema=public&sslmode=require"
NODE_ENV="development"
SWAGGER_TITLE="PPP API Gateway"
SWAGGER_DESCRIPTION="API Gateway para el sistema de Prácticas Pre-Profesionales"
SWAGGER_VERSION="1.0"
SWAGGER_PATH="api/docs"
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
LOG_LEVEL="debug"
```

### 4. Generar Clientes de Prisma

```bash
# Generar cliente para ppp_core
cd prisma
npx prisma generate

# Generar cliente para ppp_compañías
cd ../apps/ppp_compañias
npx prisma generate
```

### 5. Ejecutar Migraciones

```bash
# Migrar ppp_core
cd prisma
npx prisma migrate deploy

# Migrar ppp_compañías
cd ../apps/ppp_compañias/prisma
npx prisma migrate deploy
```

### 6. Iniciar Servicios

**Opción A: Desarrollo (modo watch)**

Terminal 1:
```bash
npm run start:dev ppp_core
```

Terminal 2:
```bash
npm run start:dev ppp_compañias
```

Terminal 3:
```bash
npm run start:dev ppaz-api-gateway
```

**Opción B: Producción**

```bash
# Build
npm run build ppp_core
npm run build ppp_compañias
npm run build ppaz-api-gateway

# Start
npm run start:prod ppp_core
npm run start:prod ppp_compañias
npm run start:prod ppaz-api-gateway
```

---

## 💚 Health Checks

### Endpoints Disponibles

Cada servicio tiene 3 endpoints de health check:

#### 1. `/health` - Health Check Completo
Verifica:
- Conectividad con base de datos
- Uso de memoria (heap y RSS)
- Uso de disco
- (Solo Gateway) Conectividad con microservicios

```bash
# ppp_core
curl http://localhost:3001/health

# ppp_compañías
curl http://localhost:3002/health

# API Gateway
curl http://localhost:3000/health
```

#### 2. `/health/ready` - Readiness Probe
Verifica si el servicio está listo para recibir tráfico:
- ppp_core/ppp_compañías: Chequea base de datos
- Gateway: Chequea conectividad con microservicios

```bash
curl http://localhost:3000/health/ready
```

#### 3. `/health/live` - Liveness Probe
Verifica que el proceso está vivo (respuesta simple)

```bash
curl http://localhost:3000/health/live
```

### Respuesta Ejemplo

```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    },
    "memory_heap": {
      "status": "up"
    },
    "memory_rss": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    },
    "memory_heap": {
      "status": "up"
    },
    "memory_rss": {
      "status": "up"
    }
  }
}
```

---

## ☁️ Despliegue en Azure

Ver guía completa en [`AZURE_DEPLOYMENT.md`](./AZURE_DEPLOYMENT.md)

### Resumen Rápido

1. **Crear App Services**
   - ppp-core-service
   - ppp-companias-service
   - ppaz-api-gateway

2. **Configurar Variables de Entorno** en Azure Portal > App Service > Configuration

3. **Desplegar**
   ```bash
   # Build
   npm run build ppp_core
   npm run build ppp_compañias
   npm run build ppaz-api-gateway
   
   # Deploy con Azure CLI
   az webapp deployment source config-zip ...
   ```

4. **Verificar Health Checks**
   ```bash
   curl https://ppaz-api-gateway.azurewebsites.net/health
   ```

### Recomendaciones para Azure

✅ **Usar Azure Container Apps** en lugar de App Service para mejor soporte de TCP  
✅ **Application Insights** para monitoreo  
✅ **Azure Key Vault** para secretos  
✅ **Azure PostgreSQL** con firewall configurado  

---

## 📚 API Documentation

### Swagger UI

Una vez iniciado el API Gateway, acceder a:

```
http://localhost:3000/api/docs
```

### Endpoints Principales

#### ppp_core (via Gateway)
- `POST /usuarios` - Crear usuario
- `GET /usuarios` - Listar usuarios
- `POST /facultades` - Crear facultad
- `GET /escuelas` - Listar escuelas
- `POST /alumnos` - Registrar alumno

#### ppp_compañías (via Gateway)
- `POST /empresas` - Registrar empresa
- `GET /empresas` - Listar empresas
- `POST /cartas` - Crear carta de presentación
- `PUT /cartas/:id/enviar` - Enviar carta
- `PUT /cartas/:id/aprobar` - Aprobar carta

---

## 🔧 Scripts Útiles

```bash
# Desarrollo
npm run start:dev <app-name>

# Build
npm run build <app-name>

# Producción
npm run start:prod <app-name>

# Tests
npm run test <app-name>

# Linting
npm run lint

# Formateo
npm run format
```

---

## 📂 Estructura del Proyecto

```
PNest_AzP/
├── apps/
│   ├── ppaz-api-gateway/          # API Gateway (HTTP)
│   │   ├── src/
│   │   │   ├── config/            # Validación de env vars
│   │   │   ├── health/            # Health checks
│   │   │   ├── modules/           # Gateway modules
│   │   │   │   ├── usuarios/
│   │   │   │   ├── facultades/
│   │   │   │   ├── empresas/
│   │   │   │   └── cartas-presentacion/
│   │   │   └── main.ts
│   │   └── .env
│   ├── ppp_core/                  # Microservicio Core (TCP)
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── health/
│   │   │   ├── modules/
│   │   │   ├── prisma/
│   │   │   └── main.ts
│   │   └── .env
│   └── ppp_compañias/             # Microservicio Compañías (TCP)
│       ├── src/
│       │   ├── config/
│       │   ├── health/
│       │   ├── modules/
│       │   ├── prisma/
│       │   └── main.ts
│       └── .env
├── prisma/                        # Esquema DB Core
│   └── schema.prisma
├── AZURE_DEPLOYMENT.md            # Guía de despliegue
└── .env.example                   # Template de configuración
```

---

## 🔐 Seguridad

- ✅ Variables de entorno para credenciales
- ✅ Validación de DTOs con class-validator
- ✅ Rate limiting en API Gateway
- ✅ SSL para conexiones a Azure PostgreSQL
- ⚠️ **TODO**: Implementar autenticación JWT
- ⚠️ **TODO**: Role-based access control (RBAC)

---

## 📊 Monitoreo

### Localmente
- Logs en consola con niveles configurables
- Health checks en `/health`

### Azure (Producción)
- Application Insights para APM
- Log Analytics para logs centralizados
- Azure Monitor para alertas
- Health checks para Azure Load Balancer

---

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📝 Licencia

Universidad Peruana Unión - Sistema PPP

---

## 👥 Autores

- Desarrollado para Universidad Peruana Unión
- Sistema de Prácticas Pre-Profesionales

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
```bash
# Verificar connection string
echo $DATABASE_URL_CORE

# Verificar conectividad
psql $DATABASE_URL_CORE
```

### Error: "Microservice timeout"
```bash
# Verificar que ambos microservicios están corriendo
curl http://localhost:3001/health/live
curl http://localhost:3002/health/live
```

### Error: "Port already in use"
```bash
# Encontrar proceso usando el puerto
netstat -ano | findstr :3000

# Matar proceso
taskkill /PID <pid> /F
```

---

## 📞 Soporte

Para soporte técnico o preguntas, contactar al equipo de desarrollo.
