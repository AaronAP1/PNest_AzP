# ============================================
# GUÍA DE USO DE SCRIPTS DE DESPLIEGUE
# ============================================

## 📋 SCRIPTS DISPONIBLES

### 1. `deploy-azure.ps1` - Despliegue completo
Despliega toda la infraestructura en Azure Container Apps.

**Uso:**
```powershell
.\deploy-azure.ps1
```

**Lo que hace:**
- ✅ Crea Resource Group en Azure
- ✅ Crea Azure Container Registry (ACR)
- ✅ Crea Container Apps Environment
- ✅ Construye las 3 imágenes Docker
- ✅ Sube las imágenes al ACR
- ✅ Despliega los 3 Container Apps
- ✅ Configura variables de entorno
- ✅ Genera archivo `deployment-info.txt` con URLs

**Prerequisitos:**
- Azure CLI instalado y logueado (`az login`)
- Docker Desktop corriendo
- Actualizar las connection strings en el script (líneas 21-22)

**Duración estimada:** 10-15 minutos

---

### 2. `update-deployment.ps1` - Actualizar servicios
Actualiza uno o todos los servicios con nuevos cambios.

**Uso:**
```powershell
# Actualizar todos los servicios
.\update-deployment.ps1

# Actualizar solo API Gateway
.\update-deployment.ps1 -Service gateway

# Actualizar solo ppp_core
.\update-deployment.ps1 -Service core

# Actualizar solo ppp_compañías
.\update-deployment.ps1 -Service companias
```

**Lo que hace:**
- ✅ Lee configuración del deployment-info.txt
- ✅ Construye nueva imagen Docker
- ✅ Sube al ACR
- ✅ Actualiza el Container App
- ✅ Azure hace rollout automático sin downtime

**Cuándo usar:**
- Después de cambiar código
- Para desplegar hotfixes
- Para actualizar configuración

**Duración estimada:** 3-5 minutos por servicio

---

### 3. `cleanup-azure.ps1` - Eliminar recursos
Elimina todos los recursos de Azure (útil para desarrollo).

**Uso:**
```powershell
.\cleanup-azure.ps1
```

**Lo que hace:**
- ⚠️ Elimina PERMANENTEMENTE todo el Resource Group
- ⚠️ Incluye: Container Apps, ACR, Environment, imágenes

**PRECAUCIÓN:** Esta acción NO SE PUEDE DESHACER.
Usa solo en entornos de desarrollo/prueba.

---

## 🚀 FLUJO DE TRABAJO TÍPICO

### Primera vez (despliegue inicial):

1. **Preparación:**
   ```powershell
   # Verificar prerequisitos
   az --version
   docker --version
   az login
   ```

2. **Actualizar connection strings:**
   Edita `deploy-azure.ps1` líneas 21-22 con tus valores reales:
   ```powershell
   $DB_CORE = "postgresql://user:pass@host:5432/db?sslmode=require"
   $DB_COMPANIAS = "postgresql://user:pass@host:5432/db?sslmode=require"
   ```

3. **Desplegar:**
   ```powershell
   .\deploy-azure.ps1
   ```

4. **Verificar:**
   - Abrir la URL del Swagger que aparece al final
   - Probar endpoint: `GET /health`

---

### Actualizaciones posteriores:

1. **Hacer cambios en el código**
   ```powershell
   # Por ejemplo, editar apps/ppaz-api-gateway/src/main.ts
   ```

2. **Actualizar solo ese servicio:**
   ```powershell
   .\update-deployment.ps1 -Service gateway
   ```

3. **Verificar cambios:**
   - Los cambios están disponibles en ~2 minutos
   - Azure hace rollout sin downtime

---

### Limpiar recursos (desarrollo):

```powershell
# Al final del día o cuando termines de probar
.\cleanup-azure.ps1
```

---

## 📊 MONITORING Y DEBUGGING

### Ver logs en tiempo real:

```powershell
# API Gateway
az containerapp logs show --name ppaz-api-gateway --resource-group rg-ppp-microservices --follow

# ppp_core
az containerapp logs show --name ppp-core-service --resource-group rg-ppp-microservices --follow

# ppp_compañías
az containerapp logs show --name ppp-companias-service --resource-group rg-ppp-microservices --follow
```

### Ver estado de los servicios:

```powershell
# Listar todas las apps
az containerapp list --resource-group rg-ppp-microservices -o table

# Ver detalles de una app
az containerapp show --name ppaz-api-gateway --resource-group rg-ppp-microservices

# Ver revisiones (historial de deployments)
az containerapp revision list --name ppaz-api-gateway --resource-group rg-ppp-microservices -o table
```

### Ver métricas:

```powershell
# Réplicas activas
az containerapp replica list --name ppaz-api-gateway --resource-group rg-ppp-microservices -o table

# Escalar manualmente
az containerapp update --name ppaz-api-gateway --resource-group rg-ppp-microservices --min-replicas 2 --max-replicas 10
```

---

## 🔧 CONFIGURACIÓN AVANZADA

### Cambiar variables de entorno sin rebuild:

```powershell
# Por ejemplo, cambiar LOG_LEVEL a 'debug'
az containerapp update `
  --name ppaz-api-gateway `
  --resource-group rg-ppp-microservices `
  --set-env-vars "LOG_LEVEL=debug"
```

### Rollback a versión anterior:

```powershell
# Listar revisiones
az containerapp revision list --name ppaz-api-gateway --resource-group rg-ppp-microservices -o table

# Activar revisión anterior
az containerapp revision activate `
  --name ppaz-api-gateway `
  --resource-group rg-ppp-microservices `
  --revision ppaz-api-gateway--<revision-name>
```

### Configurar dominio custom:

```powershell
# 1. Agregar dominio
az containerapp hostname add `
  --name ppaz-api-gateway `
  --resource-group rg-ppp-microservices `
  --hostname api.tudominio.com

# 2. Obtener IP o CNAME para configurar DNS
az containerapp show `
  --name ppaz-api-gateway `
  --resource-group rg-ppp-microservices `
  --query properties.configuration.ingress.fqdn
```

---

## ⚠️ TROUBLESHOOTING COMÚN

### Error: "Image pull failed"
**Solución:**
```powershell
# Re-login al ACR
az acr login --name <tu-acr-name>

# Verificar que la imagen existe
az acr repository show-tags --name <tu-acr-name> --repository ppaz-gateway
```

### Error: "Can't connect to database"
**Solución:**
```powershell
# Verificar firewall de PostgreSQL
az postgres flexible-server firewall-rule list `
  --resource-group <tu-rg> `
  --name <tu-postgres-server>

# Permitir Azure services
az postgres flexible-server firewall-rule create `
  --resource-group <tu-rg> `
  --name <tu-postgres-server> `
  --rule-name AllowAzureServices `
  --start-ip-address 0.0.0.0 `
  --end-ip-address 0.0.0.0
```

### Error: "Container App not responding"
**Solución:**
```powershell
# Ver logs para diagnóstico
az containerapp logs show --name ppaz-api-gateway --resource-group rg-ppp-microservices --tail 100

# Reiniciar replica
az containerapp replica restart `
  --name ppaz-api-gateway `
  --resource-group rg-ppp-microservices `
  --replica <replica-name>
```

---

## 💰 CONTROL DE COSTOS

### Ver costos actuales:
```powershell
# Costos del Resource Group
az consumption usage list --start-date 2025-11-01 --end-date 2025-11-30
```

### Optimizar costos:
```powershell
# Reducir réplicas mínimas a 0 (escala a 0 cuando no hay tráfico)
az containerapp update `
  --name ppaz-api-gateway `
  --resource-group rg-ppp-microservices `
  --min-replicas 0 `
  --max-replicas 3

# Pausar servicios en desarrollo (fuera de horas de trabajo)
az containerapp update `
  --name ppaz-api-gateway `
  --resource-group rg-ppp-microservices `
  --min-replicas 0 `
  --max-replicas 0
```

---

## 📚 RECURSOS ADICIONALES

- [Azure Container Apps Docs](https://learn.microsoft.com/azure/container-apps/)
- [Azure CLI Reference](https://learn.microsoft.com/cli/azure/)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)

---

## 🆘 SOPORTE

Si encuentras problemas:

1. **Revisa los logs** primero
2. **Verifica el archivo** `deployment-info.txt`
3. **Consulta la documentación** de Azure Container Apps
4. **Prueba localmente con Docker** antes de desplegar

---

¿Preguntas? Abre un issue en el repositorio.
