# ==============================================================================
# Guía: Configuración de Bases de Datos en Azure PostgreSQL
# ==============================================================================

## Requisitos Previos
- Azure CLI instalado
- Cuenta de Azure con permisos de administrador
- Azure PostgreSQL Flexible Server creado

## 📝 PASO 1: Crear las bases de datos

```powershell
# Ejecutar el script de creación
.\scripts\create-azure-databases.ps1 `
    -ServerName "tu-servidor-postgres" `
    -AdminUser "tuadmin" `
    -AdminPassword "TuPassword123!" `
    -ResourceGroup "ppp-resources"
```

## 📝 PASO 2: Configurar variables de entorno

Agregar al archivo `.env` en la raíz del proyecto:

```env
# ===================================
# BASES DE DATOS AZURE POSTGRESQL
# ===================================

# Auth Service
DATABASE_URL_AUTH="postgresql://tuadmin:TuPassword123!@tu-servidor-postgres.postgres.database.azure.com:5432/ppp_auth_db?schema=public"

# Academic Service
DATABASE_URL_ACADEMIC="postgresql://tuadmin:TuPassword123!@tu-servidor-postgres.postgres.database.azure.com:5432/ppp_academic_db?schema=public"

# Core Service
DATABASE_URL_CORE="postgresql://tuadmin:TuPassword123!@tu-servidor-postgres.postgres.database.azure.com:5432/ppp_core_db?schema=public"

# Evaluaciones Service
DATABASE_URL_EVALUACIONES="postgresql://tuadmin:TuPassword123!@tu-servidor-postgres.postgres.database.azure.com:5432/ppp_evaluaciones_db?schema=public"
```

## 📝 PASO 3: Generar clientes de Prisma

```powershell
# Generar cliente para Auth Service
npx prisma generate --schema=./apps/ppp-auth-service/prisma/schema.prisma

# Generar cliente para Academic Service (ppp_core)
npx prisma generate --schema=./prisma/schema.prisma

# Generar cliente para Core Service (ppp_compañias)
npx prisma generate --schema=./apps/ppp_compañias/prisma/schema.prisma

# Generar cliente para Evaluaciones Service
npx prisma generate --schema=./apps/ppp-evaluaciones-service/prisma/schema.prisma
```

## 📝 PASO 4: Crear y aplicar migraciones

```powershell
# Auth Service
npx prisma migrate dev --schema=./apps/ppp-auth-service/prisma/schema.prisma --name init_auth

# Academic Service
npx prisma migrate dev --schema=./prisma/schema.prisma --name init_academic

# Core Service
npx prisma migrate dev --schema=./apps/ppp_compañias/prisma/schema.prisma --name init_core

# Evaluaciones Service
npx prisma migrate dev --schema=./apps/ppp-evaluaciones-service/prisma/schema.prisma --name init_evaluaciones
```

## 📝 PASO 5: Configurar reglas de firewall

```powershell
# Permitir acceso desde tu IP actual
az postgres flexible-server firewall-rule create `
    --resource-group ppp-resources `
    --name tu-servidor-postgres `
    --rule-name AllowMyIP `
    --start-ip-address TU_IP `
    --end-ip-address TU_IP

# Permitir acceso desde Azure Services
az postgres flexible-server firewall-rule create `
    --resource-group ppp-resources `
    --name tu-servidor-postgres `
    --rule-name AllowAzureServices `
    --start-ip-address 0.0.0.0 `
    --end-ip-address 0.0.0.0
```

## 📝 PASO 6: Verificar conexión

```powershell
# Probar conexión con psql
psql "host=tu-servidor-postgres.postgres.database.azure.com port=5432 dbname=ppp_auth_db user=tuadmin password=TuPassword123! sslmode=require"
```

## 🔍 Troubleshooting

### Error: "No such host is known"
- Verifica que el nombre del servidor sea correcto
- Asegúrate de incluir `.postgres.database.azure.com`

### Error: "Connection timeout"
- Revisa las reglas de firewall
- Verifica que tu IP esté permitida

### Error: "Password authentication failed"
- Verifica usuario y contraseña
- Intenta resetear la contraseña del admin

## 📊 Resumen de Microservicios

| Microservicio | Base de Datos | Puerto | Tablas |
|---------------|---------------|--------|---------|
| ppp-auth-service | ppp_auth_db | 3001 | usuario, rol, usuario_rol |
| ppp_core (academic) | ppp_academic_db | 3002 | facultad, escuela, alumno, secretaria, supervisor, coordinador, linea_facultad |
| ppp_compañias (core) | ppp_core_db | 3003 | empresa, solicitud_ppp, carta_presentacion, reuniones, tipo_documento, documento |
| ppp-evaluaciones-service | ppp_evaluaciones_db | 3004 | evaluacion_supervisor, evaluacion_preguntas, preguntas, evaluacion_practicante, etc. |
| ppaz-api-gateway | - | 3000 | (sin BD, solo enruta) |
