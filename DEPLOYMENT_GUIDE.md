# ============================================
# GUÍA DE DESPLIEGUE EN AZURE
# ============================================

## PREREQUISITOS

1. **Azure CLI instalado**: https://docs.microsoft.com/cli/azure/install-azure-cli
2. **Docker Desktop instalado** (para probar localmente)
3. **Cuenta de Azure activa**

```bash
# Verificar instalaciones
az --version
docker --version

# Login a Azure
az login
```

---

## OPCIÓN 1: AZURE CONTAINER APPS (RECOMENDADO)

Azure Container Apps es perfecto para microservicios con TCP porque:
- ✅ Soporta TCP nativo entre contenedores
- ✅ Service discovery automático
- ✅ Escala automáticamente
- ✅ Más barato que AKS
- ✅ Managed service (sin preocuparte por infraestructura)

### PASO 1: Configurar variables

```bash
# Configuración
RESOURCE_GROUP="rg-ppp-microservices"
LOCATION="eastus"
ENVIRONMENT="ppp-env"
ACR_NAME="acrpppnest"  # Debe ser único globalmente
```

### PASO 2: Crear recursos en Azure

```bash
# 1. Crear Resource Group
az group create --name $RESOURCE_GROUP --location $LOCATION

# 2. Crear Azure Container Registry (para guardar imágenes Docker)
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true

# 3. Obtener credenciales del ACR
az acr credential show --name $ACR_NAME

# 4. Crear Container Apps Environment
az containerapp env create \
  --name $ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

### PASO 3: Construir y subir imágenes Docker

Desde la raíz del proyecto:

```bash
# Login al ACR
az acr login --name $ACR_NAME

# Build y push ppp_core
docker build -t $ACR_NAME.azurecr.io/ppp-core:latest -f apps/ppp_core/Dockerfile .
docker push $ACR_NAME.azurecr.io/ppp-core:latest

# Build y push ppp_compañías
docker build -t $ACR_NAME.azurecr.io/ppp-companias:latest -f apps/ppp_compañias/Dockerfile .
docker push $ACR_NAME.azurecr.io/ppp-companias:latest

# Build y push API Gateway
docker build -t $ACR_NAME.azurecr.io/ppaz-gateway:latest -f apps/ppaz-api-gateway/Dockerfile .
docker push $ACR_NAME.azurecr.io/ppaz-gateway:latest
```

### PASO 4: Desplegar Container Apps

```bash
# Variables de base de datos (REEMPLAZA CON TUS VALORES REALES)
DB_CORE="postgresql://pppNest_admin:Ppp2024Nest!@psql-upeu-ppp-5628.postgres.database.azure.com:5432/pppNest_Core?schema=public&sslmode=require"
DB_COMPANIAS="postgresql://pppNest_admin:Ppp2024Nest!@psql-upeu-ppp-5628.postgres.database.azure.com:5432/pppNest_Companias?schema=public&sslmode=require"

# 1. Desplegar ppp_core (microservicio interno - NO PÚBLICO)
az containerapp create \
  --name ppp-core-service \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image $ACR_NAME.azurecr.io/ppp-core:latest \
  --target-port 3001 \
  --ingress internal \
  --registry-server $ACR_NAME.azurecr.io \
  --registry-username $(az acr credential show -n $ACR_NAME --query username -o tsv) \
  --registry-password $(az acr credential show -n $ACR_NAME --query passwords[0].value -o tsv) \
  --env-vars \
    "DATABASE_URL_CORE=$DB_CORE" \
    "APP_NAME=ppp_core" \
    "PORT=3001" \
    "HOST=0.0.0.0" \
    "NODE_ENV=production" \
    "LOG_LEVEL=info" \
  --cpu 0.5 \
  --memory 1Gi \
  --min-replicas 1 \
  --max-replicas 3

# 2. Desplegar ppp_compañías (microservicio interno - NO PÚBLICO)
az containerapp create \
  --name ppp-companias-service \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image $ACR_NAME.azurecr.io/ppp-companias:latest \
  --target-port 3002 \
  --ingress internal \
  --registry-server $ACR_NAME.azurecr.io \
  --registry-username $(az acr credential show -n $ACR_NAME --query username -o tsv) \
  --registry-password $(az acr credential show -n $ACR_NAME --query passwords[0].value -o tsv) \
  --env-vars \
    "DATABASE_URL_COMPANIAS=$DB_COMPANIAS" \
    "APP_NAME=ppp_companias" \
    "PORT=3002" \
    "HOST=0.0.0.0" \
    "NODE_ENV=production" \
    "LOG_LEVEL=info" \
  --cpu 0.5 \
  --memory 1Gi \
  --min-replicas 1 \
  --max-replicas 3

# 3. Obtener FQDNs de los microservicios
CORE_FQDN=$(az containerapp show --name ppp-core-service --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)
COMPANIAS_FQDN=$(az containerapp show --name ppp-companias-service --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)

echo "Core FQDN: $CORE_FQDN"
echo "Companias FQDN: $COMPANIAS_FQDN"

# 4. Desplegar API Gateway (PÚBLICO - punto de entrada)
az containerapp create \
  --name ppaz-api-gateway \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image $ACR_NAME.azurecr.io/ppaz-gateway:latest \
  --target-port 3000 \
  --ingress external \
  --registry-server $ACR_NAME.azurecr.io \
  --registry-username $(az acr credential show -n $ACR_NAME --query username -o tsv) \
  --registry-password $(az acr credential show -n $ACR_NAME --query passwords[0].value -o tsv) \
  --env-vars \
    "APP_NAME=ppaz_api_gateway" \
    "PORT=3000" \
    "HOST=0.0.0.0" \
    "PPP_CORE_HOST=$CORE_FQDN" \
    "PPP_CORE_PORT=443" \
    "PPP_COMPANIAS_HOST=$COMPANIAS_FQDN" \
    "PPP_COMPANIAS_PORT=443" \
    "DATABASE_URL_CORE=$DB_CORE" \
    "DATABASE_URL_COMPANIAS=$DB_COMPANIAS" \
    "NODE_ENV=production" \
    "SWAGGER_TITLE=PPP API Gateway - Producción" \
    "SWAGGER_VERSION=1.0" \
    "SWAGGER_PATH=api/docs" \
    "RATE_LIMIT_TTL=60" \
    "RATE_LIMIT_MAX=100" \
    "LOG_LEVEL=info" \
  --cpu 0.5 \
  --memory 1Gi \
  --min-replicas 1 \
  --max-replicas 5
```

### PASO 5: Obtener URL pública

```bash
# Obtener URL del API Gateway
az containerapp show \
  --name ppaz-api-gateway \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn \
  -o tsv

# Ejemplo de salida: ppaz-api-gateway.proudwater-12345678.eastus.azurecontainerapps.io
```

Ahora puedes acceder a:
- **API**: https://ppaz-api-gateway.XXXXXXX.eastus.azurecontainerapps.io
- **Swagger**: https://ppaz-api-gateway.XXXXXXX.eastus.azurecontainerapps.io/api/docs
- **Health**: https://ppaz-api-gateway.XXXXXXX.eastus.azurecontainerapps.io/health

---

## OPCIÓN 2: AZURE APP SERVICE (Alternativa más simple pero con limitaciones TCP)

⚠️ **Problema**: Azure App Service **NO soporta TCP entre servicios** fácilmente. Tendrías que:
1. Cambiar Transport.TCP a Transport.REDIS
2. Usar Azure Cache for Redis como intermediario

Si quieres esta opción, puedo ayudarte pero **recomiendo Container Apps**.

---

## TESTING LOCAL CON DOCKER

Antes de subir a Azure, prueba localmente:

```bash
# Desde la raíz del proyecto

# 1. Build imágenes
docker build -t ppp-core:local -f apps/ppp_core/Dockerfile .
docker build -t ppp-companias:local -f apps/ppp_compañias/Dockerfile .
docker build -t ppaz-gateway:local -f apps/ppaz-api-gateway/Dockerfile .

# 2. Crear red Docker
docker network create ppp-network

# 3. Run ppp_core
docker run -d \
  --name ppp-core \
  --network ppp-network \
  -e DATABASE_URL_CORE="tu_connection_string" \
  -e PORT=3001 \
  -e HOST=0.0.0.0 \
  -e NODE_ENV=production \
  ppp-core:local

# 4. Run ppp_compañías
docker run -d \
  --name ppp-companias \
  --network ppp-network \
  -e DATABASE_URL_COMPANIAS="tu_connection_string" \
  -e PORT=3002 \
  -e HOST=0.0.0.0 \
  -e NODE_ENV=production \
  ppp-companias:local

# 5. Run API Gateway
docker run -d \
  --name ppaz-gateway \
  --network ppp-network \
  -p 3000:3000 \
  -e PORT=3000 \
  -e HOST=0.0.0.0 \
  -e PPP_CORE_HOST=ppp-core \
  -e PPP_CORE_PORT=3001 \
  -e PPP_COMPANIAS_HOST=ppp-companias \
  -e PPP_COMPANIAS_PORT=3002 \
  -e DATABASE_URL_CORE="tu_connection_string" \
  -e DATABASE_URL_COMPANIAS="tu_connection_string" \
  ppaz-gateway:local

# Test
curl http://localhost:3000/health/live
```

---

## MONITORING Y LOGS

```bash
# Ver logs de un container app
az containerapp logs show \
  --name ppaz-api-gateway \
  --resource-group $RESOURCE_GROUP \
  --follow

# Ver métricas
az monitor metrics list \
  --resource /subscriptions/{subscription-id}/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/containerApps/ppaz-api-gateway

# Habilitar Application Insights (recomendado)
# Ver: https://learn.microsoft.com/azure/container-apps/observability
```

---

## ACTUALIZAR DEPLOYMENT

Cuando hagas cambios:

```bash
# 1. Build nueva imagen
docker build -t $ACR_NAME.azurecr.io/ppaz-gateway:v2 -f apps/ppaz-api-gateway/Dockerfile .
docker push $ACR_NAME.azurecr.io/ppaz-gateway:v2

# 2. Update container app
az containerapp update \
  --name ppaz-api-gateway \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_NAME.azurecr.io/ppaz-gateway:v2
```

---

## COSTOS ESTIMADOS (USD/mes)

- **Container Apps Environment**: ~$0
- **Container Apps (3 apps, 1 replica cada uno)**: ~$30-50/mes
- **Azure Container Registry (Basic)**: ~$5/mes
- **PostgreSQL**: Ya lo tienes
- **Total estimado**: ~$35-55/mes

---

## SEGURIDAD

### 1. No expongas credenciales
```bash
# Usar Azure Key Vault
az keyvault create \
  --name kv-ppp-secrets \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Guardar secrets
az keyvault secret set \
  --vault-name kv-ppp-secrets \
  --name db-core-connection \
  --value "$DB_CORE"
```

### 2. Configurar firewall de PostgreSQL
```bash
# Permitir acceso desde Container Apps
az postgres flexible-server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --name psql-upeu-ppp-5628 \
  --rule-name allow-azure-services \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

---

## TROUBLESHOOTING

### Error: "Can't connect to microservices"
- Verifica que los FQDNs sean correctos
- Container Apps usa HTTPS (puerto 443) para ingress interno
- Actualiza PORT a 443 en las variables de entorno del Gateway

### Error: "Database connection failed"
- Verifica firewall de PostgreSQL
- Confirma connection strings correctos
- Verifica que `sslmode=require` esté en la cadena

### Error: "Image pull failed"
- Verifica credenciales del ACR
- Asegúrate que las imágenes estén pusheadas

---

## PRÓXIMOS PASOS

1. ✅ **Probar localmente con Docker**
2. ✅ **Desplegar en Azure Container Apps**
3. ⚠️ **Configurar dominio custom** (opcional)
4. ⚠️ **Configurar Application Insights** para monitoring
5. ⚠️ **Setup CI/CD con GitHub Actions** (automatizar deployments)

¿Quieres ayuda con algún paso específico?
