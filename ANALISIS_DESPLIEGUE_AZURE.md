# ANÁLISIS DEL DESPLIEGUE ACTUAL EN AZURE

## 📊 ESTADO ACTUAL (Antes de los cambios)

### Recursos Desplegados:
- **Resource Group**: `rg-ppp-microservices`
- **Region**: `brazilsouth` (Brazil South)
- **Container Registry**: `acrpppnest3008.azurecr.io`
- **Environment**: `ppp-env`

### Microservicios Desplegados (ARQUITECTURA ANTERIOR):

| Servicio | URL | Puerto | Estado |
|----------|-----|--------|--------|
| **ppp-core-service** | `ppp-core-service.internal....azurecontainerapps.io` | 3001 | ✅ Running |
| **ppp-companias-service** | `ppp-companias-service.internal....azurecontainerapps.io` | 3002 | ✅ Running |
| **ppaz-api-gateway** | `ppaz-api-gateway.whitesand-5e7ae56f.brazilsouth.azurecontainerapps.io` | 3000 | ✅ Running |

### Problemas Identificados en la Configuración Anterior:

1. ❌ **Puertos incorrectos en env-core.json**: 
   - Tenía `PORT=3001` pero el servicio corre en `3002`
   
2. ❌ **Puertos incorrectos en env-companias.json**: 
   - Tenía `PORT=3002` pero el servicio corre en `3003`

3. ❌ **Gateway con configuración inconsistente**:
   - `env-gateway.json` tiene `PPP_CORE_PORT=443` (HTTPS interno)
   - Debería apuntar a los servicios internos con HTTPS

4. ⚠️ **Falta desplegar los nuevos servicios**:
   - `ppp-auth-service` (Puerto 3001)
   - `ppp-evaluaciones-service` (Puerto 3004)

---

## 🎯 NUEVA ARQUITECTURA (Después de los cambios)

### Microservicios a Desplegar:

| # | Servicio | Puerto Local | Puerto Azure | Base de Datos | Estado |
|---|----------|--------------|--------------|---------------|--------|
| 1 | **ppp-auth-service** | 3001 | 3001 | pppNest_Core | 🆕 **NUEVO** |
| 2 | **ppp-core** | 3002 | 3002 | pppNest_Core | ✅ Actualizar |
| 3 | **ppp-companias** | 3003 | 3003 | pppNest_Companias | ✅ Actualizar |
| 4 | **ppp-evaluaciones-service** | 3004 | 3004 | pppNest_Core | 🆕 **NUEVO** |
| 5 | **ppaz-api-gateway** | 3000 | 3000 | N/A (solo proxy) | ✅ Actualizar |

### Arquitectura de Comunicación:

```
Internet
   ↓
ppaz-api-gateway (3000) [PÚBLICO]
   ↓ HTTPS
   ├─→ ppp-auth-service (3001) [INTERNO]
   ├─→ ppp-core (3002) [INTERNO]  
   ├─→ ppp-companias (3003) [INTERNO]
   └─→ ppp-evaluaciones (3004) [INTERNO]
```

---

## 📝 PLAN DE ACTUALIZACIÓN

### Opción 1: UPDATE (RECOMENDADO) ✅
**Actualizar los recursos existentes y añadir los nuevos**

#### Ventajas:
- ✅ Mantiene la misma URL pública del gateway
- ✅ No pierde configuración de Azure (logs, métricas, alertas)
- ✅ Menos costos (no duplica recursos)
- ✅ Rollback más fácil si algo falla

#### Pasos:
1. Crear Dockerfiles para `ppp-auth-service` y `ppp-evaluaciones-service`
2. Actualizar archivos JSON de configuración (`env-*.json`)
3. Build y push de TODAS las imágenes (actualiza las 3 existentes + 2 nuevas)
4. Desplegar los 2 servicios nuevos en Azure Container Apps
5. Actualizar los 3 servicios existentes con nuevas configuraciones
6. Verificar health checks y endpoints

### Opción 2: CREATE NEW (No recomendado)
**Crear recursos completamente nuevos**

#### Desventajas:
- ❌ Pérdida de URL pública actual
- ❌ Duplica costos temporalmente
- ❌ Requiere reconfigurar DNS, certificados, etc.
- ❌ Migración de datos/configuraciones manuales

---

## ✅ DECISIÓN: UPDATE

Vamos a **ACTUALIZAR** los recursos existentes porque:

1. Ya tienes infraestructura funcionando
2. La URL pública del gateway seguirá siendo la misma
3. Solo necesitas agregar 2 servicios nuevos
4. Los cambios en los 3 servicios existentes son configuraciones (puertos)

---

## 🔧 ARCHIVOS QUE NECESITAN ACTUALIZACIÓN

### 1. Archivos JSON de Configuración

#### ✅ `env-auth.json` (NUEVO)
```json
[
  {
    "name": "DATABASE_URL",
    "value": "postgresql://pgNestAdmin:aA1234567*@s-ppp-nest.postgres.database.azure.com:5432/pppNest_Core?sslmode=require"
  },
  {
    "name": "APP_NAME",
    "value": "ppp_auth_service"
  },
  {
    "name": "PORT",
    "value": "3001"
  },
  {
    "name": "NODE_ENV",
    "value": "production"
  },
  {
    "name": "JWT_SECRET",
    "value": "your-production-jwt-secret-change-this"
  },
  {
    "name": "JWT_EXPIRATION",
    "value": "24h"
  }
]
```

#### ✅ `env-evaluaciones.json` (NUEVO)
```json
[
  {
    "name": "DATABASE_URL",
    "value": "postgresql://pgNestAdmin:aA1234567*@s-ppp-nest.postgres.database.azure.com:5432/pppNest_Core?sslmode=require"
  },
  {
    "name": "APP_NAME",
    "value": "ppp_evaluaciones_service"
  },
  {
    "name": "PORT",
    "value": "3004"
  },
  {
    "name": "NODE_ENV",
    "value": "production"
  }
]
```

#### ✅ `env-core.json` (ACTUALIZAR)
**CAMBIO**: `PORT` de `3001` → `3002`

#### ✅ `env-companias.json` (ACTUALIZAR)
**CAMBIO**: `PORT` de `3002` → `3003`

#### ✅ `env-gateway.json` (ACTUALIZAR)
**CAMBIOS**:
- Agregar variables para `ppp-auth-service`
- Agregar variables para `ppp-evaluaciones-service`
- Mantener HTTPS (443) para servicios internos

---

## 🐳 DOCKERFILES

### Estado de los Dockerfiles:

| Servicio | Dockerfile | Estado |
|----------|-----------|--------|
| ppp-core | ✅ `apps/ppp_core/Dockerfile` | Existe |
| ppp-companias | ✅ `apps/ppp_compañias/Dockerfile` | Existe |
| ppaz-gateway | ✅ `apps/ppaz-api-gateway/Dockerfile` | Existe |
| ppp-auth | ✅ `apps/ppp-auth-service/Dockerfile` | Existe |
| ppp-evaluaciones | ✅ `apps/ppp-evaluaciones-service/Dockerfile` | Existe |

**Todos los Dockerfiles existen** ✅

---

## 📋 CHECKLIST DE DESPLIEGUE

### Pre-Despliegue:
- [ ] Crear `env-auth.json`
- [ ] Crear `env-evaluaciones.json`
- [ ] Actualizar `env-core.json` (puerto 3002)
- [ ] Actualizar `env-companias.json` (puerto 3003)
- [ ] Actualizar `env-gateway.json` (agregar auth y evaluaciones)
- [ ] Verificar que todos los Dockerfiles tienen EXPOSE correcto
- [ ] Verificar credenciales de Azure (`az login`)

### Despliegue:
- [ ] Build imagen: `ppp-auth-service`
- [ ] Build imagen: `ppp-evaluaciones-service`
- [ ] Rebuild imagen: `ppp-core` (con puerto 3002)
- [ ] Rebuild imagen: `ppp-companias` (con puerto 3003)
- [ ] Rebuild imagen: `ppaz-gateway` (con nuevos endpoints)
- [ ] Push todas las imágenes a ACR
- [ ] Deploy `ppp-auth-service` (nuevo)
- [ ] Deploy `ppp-evaluaciones-service` (nuevo)
- [ ] Update `ppp-core-service`
- [ ] Update `ppp-companias-service`
- [ ] Update `ppaz-api-gateway`

### Post-Despliegue:
- [ ] Verificar health check de cada servicio
- [ ] Verificar logs de cada container
- [ ] Probar endpoints del gateway
- [ ] Verificar Swagger UI
- [ ] Probar endpoints de los 7 módulos corregidos:
  - [ ] `/alumnos`
  - [ ] `/facultades`
  - [ ] `/escuelas`
  - [ ] `/secretarias`
  - [ ] `/supervisores`
  - [ ] `/coordinadores`
  - [ ] `/lineas-facultad`

---

## 🚀 PRÓXIMO PASO

**¿Proceder con la actualización del despliegue?**

1. ✅ Crear archivos de configuración JSON actualizados
2. ✅ Actualizar script de despliegue `update-deployment.ps1`
3. ✅ Ejecutar despliegue completo

**Tiempo estimado**: 15-20 minutos (build + push + deploy)

**Costo adicional**: ~$5-10 USD/mes por los 2 nuevos servicios
