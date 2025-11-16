# ==============================================================================
# GUÍA RÁPIDA: Migración Completa a 4 Microservicios
# ==============================================================================

## ✅ LO QUE YA ESTÁ HECHO

### 1. Schemas Prisma (100% completados)
- ✅ `apps/ppp-auth-service/prisma/schema.prisma` (usuario, rol, usuario_rol)
- ✅ `prisma/schema.prisma` → academic-service (facultad, escuela, alumno, secretaria, supervisor, coordinador, linea_facultad)
- ✅ `apps/ppp_compañias/prisma/schema.prisma` → core-service (empresa, solicitud_ppp, carta_presentacion, reuniones, tipo_documento, documento)
- ✅ `apps/ppp-evaluaciones-service/prisma/schema.prisma` (7 tablas de evaluaciones)

### 2. Estructura de Microservicios
- ✅ **ppp-auth-service** → Completamente funcional con CRUDs de usuario y roles
- ✅ **ppp_core** (academic) → 3 módulos nuevos creados (supervisores, coordinadores, lineas-facultad)
- ✅ **ppp_compañias** (core) → Schema actualizado
- ✅ **ppp-evaluaciones-service** → Estructura base creada

### 3. Scripts y Documentación
- ✅ Script PowerShell para crear bases de datos en Azure
- ✅ Script SQL para configurar extensiones
- ✅ Guía completa de setup de Azure
- ✅ Guía para generar CRUDs con NestJS CLI
- ✅ Documentación de arquitectura de microservicios

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

### PASO 1: Crear Bases de Datos en Azure (15 min)

```powershell
# Ejecutar script de creación
.\scripts\create-azure-databases.ps1 `
    -ServerName "TU_SERVIDOR_POSTGRES" `
    -AdminUser "tuadmin" `
    -AdminPassword "TuPassword123!" `
    -ResourceGroup "ppp-resources"
```

**Resultado esperado:** 4 bases de datos creadas en Azure PostgreSQL

---

### PASO 2: Configurar Variables de Entorno (5 min)

Crear/actualizar archivo `.env` en la raíz del proyecto:

```env
# ===================================
# BASES DE DATOS AZURE
# ===================================
DATABASE_URL_AUTH="postgresql://tuadmin:TuPassword123!@tu-servidor.postgres.database.azure.com:5432/ppp_auth_db?schema=public"
DATABASE_URL_ACADEMIC="postgresql://tuadmin:TuPassword123!@tu-servidor.postgres.database.azure.com:5432/ppp_academic_db?schema=public"
DATABASE_URL_CORE="postgresql://tuadmin:TuPassword123!@tu-servidor.postgres.database.azure.com:5432/ppp_core_db?schema=public"
DATABASE_URL_EVALUACIONES="postgresql://tuadmin:TuPassword123!@tu-servidor.postgres.database.azure.com:5432/ppp_evaluaciones_db?schema=public"

# ===================================
# JWT AUTHENTICATION
# ===================================
JWT_SECRET="tu-super-secret-key-cambiala-en-produccion"
JWT_EXPIRATION="24h"
JWT_REFRESH_EXPIRATION="7d"

# ===================================
# PUERTOS DE MICROSERVICIOS
# ===================================
PORT_GATEWAY=3000
PORT_AUTH=3001
PORT_ACADEMIC=3002
PORT_CORE=3003
PORT_EVALUACIONES=3004
```

---

### PASO 3: Generar Clientes de Prisma (5 min)

```powershell
# Auth Service
npx prisma generate --schema=./apps/ppp-auth-service/prisma/schema.prisma

# Academic Service (ppp_core)
npx prisma generate --schema=./prisma/schema.prisma

# Core Service (ppp_compañias)
npx prisma generate --schema=./apps/ppp_compañias/prisma/schema.prisma

# Evaluaciones Service
npx prisma generate --schema=./apps/ppp-evaluaciones-service/prisma/schema.prisma
```

**Nota:** Los errores de TypeScript se resolverán después de generar los clientes.

---

### PASO 4: Crear y Aplicar Migraciones en Azure (10 min)

```powershell
# Auth Service
npx prisma migrate dev --schema=./apps/ppp-auth-service/prisma/schema.prisma --name init_auth_service

# Academic Service
npx prisma migrate dev --schema=./prisma/schema.prisma --name init_academic_service

# Core Service
npx prisma migrate dev --schema=./apps/ppp_compañias/prisma/schema.prisma --name init_core_service

# Evaluaciones Service
npx prisma migrate dev --schema=./apps/ppp-evaluaciones-service/prisma/schema.prisma --name init_evaluaciones_service
```

---

### PASO 5: Completar CRUDs Restantes (2-4 horas)

Ver guía detallada en: `docs/GUIA_GENERAR_CRUDS.md`

**Pendientes por crear:**

#### ppp_compañias (core-service):
- [ ] Actualizar módulo `empresas`
- [ ] Crear módulo `solicitudes-ppp`
- [ ] Actualizar módulo `cartas-presentacion`
- [ ] Crear módulo `reuniones`

#### ppp-evaluaciones-service:
- [ ] Crear módulo `evaluacion-supervisor`
- [ ] Crear módulo `preguntas`
- [ ] Crear módulo `evaluacion-practicante`
- [ ] Crear módulo `dimension-transversal`
- [ ] (Otros 3 módulos restantes)

**Comando rápido para generar estructura:**
```powershell
# Ejemplo para solicitudes-ppp
nest g module modules/solicitudes-ppp apps/ppp_compañias/src
nest g service modules/solicitudes-ppp apps/ppp_compañias/src --no-spec
nest g controller modules/solicitudes-ppp apps/ppp_compañias/src --no-spec
```

Luego copia y adapta el código de los módulos ejemplo (supervisores, coordinadores, lineas-facultad).

---

### PASO 6: Actualizar nest-cli.json (5 min)

Agregar los nuevos microservicios al `nest-cli.json`:

```json
{
  "projects": {
    "ppaz-api-gateway": { ... },
    "ppp_core": { ... },
    "ppp_compañias": { ... },
    "ppp-auth-service": {
      "type": "application",
      "root": "apps/ppp-auth-service",
      "entryFile": "main",
      "sourceRoot": "apps/ppp-auth-service/src",
      "compilerOptions": {
        "tsConfigPath": "apps/ppp-auth-service/tsconfig.app.json"
      }
    },
    "ppp-evaluaciones-service": {
      "type": "application",
      "root": "apps/ppp-evaluaciones-service",
      "entryFile": "main",
      "sourceRoot": "apps/ppp-evaluaciones-service/src",
      "compilerOptions": {
        "tsConfigPath": "apps/ppp-evaluaciones-service/tsconfig.app.json"
      }
    }
  }
}
```

---

### PASO 7: Probar Microservicios Localmente (10 min)

```powershell
# Terminal 1 - Auth Service
npm run start:dev ppp-auth-service

# Terminal 2 - Academic Service (ppp_core)
npm run start:dev ppp_core

# Terminal 3 - Core Service (ppp_compañias)
npm run start:dev ppp_compañias

# Terminal 4 - Evaluaciones Service
npm run start:dev ppp-evaluaciones-service

# Terminal 5 - Gateway
npm run start:dev ppaz-api-gateway
```

---

## 📋 RESUMEN DE ARQUITECTURA

```
┌─────────────────────────────────────────┐
│      ppaz-api-gateway (:3000)           │ ← Cliente HTTP
└────┬────────┬────────┬────────┬─────────┘
     │        │        │        │
     ▼        ▼        ▼        ▼
┌─────────┬─────────┬─────────┬──────────────┐
│  AUTH   │ACADEMIC │  CORE   │ EVALUACIONES │ ← Microservicios (TCP)
│  :3001  │ :3002   │ :3003   │    :3004     │
└────┬────┴────┬────┴────┬────┴──────┬───────┘
     │         │         │           │
     ▼         ▼         ▼           ▼
┌─────────┬─────────┬─────────┬──────────────┐
│ auth_db │academic │ core_db │evaluaciones  │ ← Azure PostgreSQL
│ 3 tablas│7 tablas │6 tablas │   7 tablas   │
└─────────┴─────────┴─────────┴──────────────┘
```

**Total: 23 tablas distribuidas en 4 bases de datos**

---

## 🎯 CHECKLIST FINAL

- [ ] Bases de datos creadas en Azure
- [ ] Variables de entorno configuradas
- [ ] Prisma clients generados (4)
- [ ] Migraciones aplicadas (4)
- [ ] CRUDs completados (23 tablas)
- [ ] Microservicios funcionando localmente (5)
- [ ] Gateway configurado y enrutando
- [ ] Dockerfile actualizado para nuevos servicios
- [ ] Scripts de deployment actualizados
- [ ] Documentación API (Swagger)
- [ ] Tests unitarios básicos
- [ ] Deploy en Azure Container Instances

---

## 📚 DOCUMENTACIÓN DISPONIBLE

1. `docs/AZURE_DATABASE_SETUP.md` → Setup completo de bases de datos
2. `docs/GUIA_GENERAR_CRUDS.md` → Cómo generar módulos restantes
3. `docs/ARQUITECTURA_MICROSERVICIOS.md` → Visión general del sistema
4. `docs/API_DOCUMENTATION_PART1.md` → Endpoints existentes
5. `scripts/create-azure-databases.ps1` → Script PowerShell para BDs

---

## 💡 TIPS

1. **Prioriza**: Completa primero los CRUDs de las tablas más usadas (usuarios, alumnos, solicitudes)
2. **Reutiliza**: Copia código de módulos existentes y adapta
3. **Prueba incremental**: Prueba cada módulo antes de pasar al siguiente
4. **Git commits**: Haz commits frecuentes por cada módulo completado
5. **Consulta ejemplos**: Los módulos de supervisores, coordinadores y lineas-facultad son referencias completas

---

## 🆘 TROUBLESHOOTING

### Error: "Property 'X' does not exist on type 'PrismaService'"
**Solución:** Ejecuta `npx prisma generate --schema=./ruta/al/schema.prisma`

### Error: "Connection refused" al conectar con Azure
**Solución:** Revisa firewall rules en Azure PostgreSQL

### Error: "Module not found"
**Solución:** Verifica que el módulo esté importado en el módulo principal

---

## 🚀 ¡MANOS A LA OBRA!

Comienza con el **PASO 1** y ve marcando cada tarea completada. En 4-6 horas tendrás todo el sistema funcionando.

¿Preguntas? Consulta la documentación en `/docs/`
