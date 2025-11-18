# ============================================
# SCRIPT SIMPLIFICADO DE ACTUALIZACION
# Azure Container Apps - 5 Microservicios PPP
# ============================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "ACTUALIZACION: 5 MICROSERVICIOS PPP EN AZURE" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Configuracion
$RESOURCE_GROUP = "rg-ppp-microservices"
$LOCATION = "brazilsouth"
$ENVIRONMENT = "ppp-env"
$ACR_NAME = "acrpppnest3008"

Write-Host "Resource Group: $RESOURCE_GROUP" -ForegroundColor Cyan
Write-Host "ACR Name: $ACR_NAME" -ForegroundColor Cyan
Write-Host ""

$confirm = Read-Host "Continuar con la actualizacion? (s/n)"
if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Host "Actualizacion cancelada" -ForegroundColor Yellow
    exit
}

# Verificar Azure CLI
Write-Host "Verificando Azure CLI..." -ForegroundColor Cyan
try {
    az --version | Out-Null
    Write-Host "OK Azure CLI" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Azure CLI no encontrado" -ForegroundColor Red
    exit 1
}

# Verificar Docker
Write-Host "Verificando Docker..." -ForegroundColor Cyan
try {
    docker --version | Out-Null
    Write-Host "OK Docker" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker no encontrado" -ForegroundColor Red
    exit 1
}

# Verificar login Azure
Write-Host "Verificando login Azure..." -ForegroundColor Cyan
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Host "Iniciando login..." -ForegroundColor Yellow
    az login
    $account = az account show | ConvertFrom-Json
}
Write-Host "OK Logueado como: $($account.user.name)" -ForegroundColor Green
Write-Host ""

# Obtener credenciales ACR
Write-Host "Obteniendo credenciales ACR..." -ForegroundColor Cyan
$acrCreds = az acr credential show --name $ACR_NAME 2>$null | ConvertFrom-Json
if (-not $acrCreds) {
    Write-Host "ERROR: No se pudieron obtener credenciales del ACR" -ForegroundColor Red
    exit 1
}
$ACR_USERNAME = $acrCreds.username
$ACR_PASSWORD = $acrCreds.passwords[0].value
Write-Host "OK Credenciales ACR obtenidas" -ForegroundColor Green
Write-Host ""

# Login al ACR
Write-Host "Login al ACR..." -ForegroundColor Cyan
az acr login --name $ACR_NAME
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Login ACR fallido" -ForegroundColor Red
    exit 1
}
Write-Host "OK Login ACR exitoso" -ForegroundColor Green
Write-Host ""

# BUILD Y PUSH DE IMAGENES
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "BUILD Y PUSH DE IMAGENES DOCKER" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. ppp-auth
Write-Host "[1/5] Building ppp-auth..." -ForegroundColor Cyan
docker build -t "$ACR_NAME.azurecr.io/ppp-auth:latest" -f apps/ppp-auth-service/Dockerfile .
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Build fallido" -ForegroundColor Red; exit 1 }
Write-Host "Pushing ppp-auth..." -ForegroundColor Cyan
docker push "$ACR_NAME.azurecr.io/ppp-auth:latest"
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Push fallido" -ForegroundColor Red; exit 1 }
Write-Host "OK ppp-auth" -ForegroundColor Green
Write-Host ""

# 2. ppp-core
Write-Host "[2/5] Building ppp-core..." -ForegroundColor Cyan
docker build -t "$ACR_NAME.azurecr.io/ppp-core:latest" -f apps/ppp_core/Dockerfile .
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Build fallido" -ForegroundColor Red; exit 1 }
Write-Host "Pushing ppp-core..." -ForegroundColor Cyan
docker push "$ACR_NAME.azurecr.io/ppp-core:latest"
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Push fallido" -ForegroundColor Red; exit 1 }
Write-Host "OK ppp-core" -ForegroundColor Green
Write-Host ""

# 3. ppp-companias
Write-Host "[3/5] Building ppp-companias..." -ForegroundColor Cyan
docker build -t "$ACR_NAME.azurecr.io/ppp-companias:latest" -f Dockerfile.companias .
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Build fallido" -ForegroundColor Red; exit 1 }
Write-Host "Pushing ppp-companias..." -ForegroundColor Cyan
docker push "$ACR_NAME.azurecr.io/ppp-companias:latest"
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Push fallido" -ForegroundColor Red; exit 1 }
Write-Host "OK ppp-companias" -ForegroundColor Green
Write-Host ""

# 4. ppp-evaluaciones
Write-Host "[4/5] Building ppp-evaluaciones..." -ForegroundColor Cyan
docker build -t "$ACR_NAME.azurecr.io/ppp-evaluaciones:latest" -f apps/ppp-evaluaciones-service/Dockerfile .
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Build fallido" -ForegroundColor Red; exit 1 }
Write-Host "Pushing ppp-evaluaciones..." -ForegroundColor Cyan
docker push "$ACR_NAME.azurecr.io/ppp-evaluaciones:latest"
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Push fallido" -ForegroundColor Red; exit 1 }
Write-Host "OK ppp-evaluaciones" -ForegroundColor Green
Write-Host ""

# 5. ppaz-gateway
Write-Host "[5/5] Building ppaz-gateway..." -ForegroundColor Cyan
docker build -t "$ACR_NAME.azurecr.io/ppaz-gateway:latest" -f apps/ppaz-api-gateway/Dockerfile .
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Build fallido" -ForegroundColor Red; exit 1 }
Write-Host "Pushing ppaz-gateway..." -ForegroundColor Cyan
docker push "$ACR_NAME.azurecr.io/ppaz-gateway:latest"
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Push fallido" -ForegroundColor Red; exit 1 }
Write-Host "OK ppaz-gateway" -ForegroundColor Green
Write-Host ""

# DESPLEGAR/ACTUALIZAR CONTAINER APPS
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "DESPLEGANDO CONTAINER APPS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. ppp-auth-service
Write-Host "[1/5] Desplegando ppp-auth-service..." -ForegroundColor Cyan
$authExists = az containerapp show --name ppp-auth-service --resource-group $RESOURCE_GROUP 2>$null
if ($authExists) {
    Write-Host "Actualizando servicio existente..." -ForegroundColor Yellow
    az containerapp update `
        --name ppp-auth-service `
        --resource-group $RESOURCE_GROUP `
        --image "$ACR_NAME.azurecr.io/ppp-auth:latest"
} else {
    Write-Host "Creando nuevo servicio..." -ForegroundColor Yellow
    az containerapp create `
        --name ppp-auth-service `
        --resource-group $RESOURCE_GROUP `
        --environment $ENVIRONMENT `
        --image "$ACR_NAME.azurecr.io/ppp-auth:latest" `
        --target-port 3001 `
        --ingress internal `
        --registry-server "$ACR_NAME.azurecr.io" `
        --registry-username $ACR_USERNAME `
        --registry-password "$ACR_PASSWORD" `
        --env-vars-file env-auth.json `
        --cpu 0.5 `
        --memory 1Gi `
        --min-replicas 1 `
        --max-replicas 3
}
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK ppp-auth-service" -ForegroundColor Green
} else {
    Write-Host "ERROR: Deploy fallido" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 2. ppp-core-service
Write-Host "[2/5] Actualizando ppp-core-service..." -ForegroundColor Cyan
az containerapp update `
    --name ppp-core-service `
    --resource-group $RESOURCE_GROUP `
    --image "$ACR_NAME.azurecr.io/ppp-core:latest" `
    --replace-env-vars-file env-core.json
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK ppp-core-service" -ForegroundColor Green
} else {
    Write-Host "ERROR: Update fallido" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 3. ppp-companias-service
Write-Host "[3/5] Actualizando ppp-companias-service..." -ForegroundColor Cyan
az containerapp update `
    --name ppp-companias-service `
    --resource-group $RESOURCE_GROUP `
    --image "$ACR_NAME.azurecr.io/ppp-companias:latest" `
    --replace-env-vars-file env-companias.json
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK ppp-companias-service" -ForegroundColor Green
} else {
    Write-Host "ERROR: Update fallido" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 4. ppp-evaluaciones-service
Write-Host "[4/5] Desplegando ppp-evaluaciones-service..." -ForegroundColor Cyan
$evalExists = az containerapp show --name ppp-evaluaciones-service --resource-group $RESOURCE_GROUP 2>$null
if ($evalExists) {
    Write-Host "Actualizando servicio existente..." -ForegroundColor Yellow
    az containerapp update `
        --name ppp-evaluaciones-service `
        --resource-group $RESOURCE_GROUP `
        --image "$ACR_NAME.azurecr.io/ppp-evaluaciones:latest"
} else {
    Write-Host "Creando nuevo servicio..." -ForegroundColor Yellow
    az containerapp create `
        --name ppp-evaluaciones-service `
        --resource-group $RESOURCE_GROUP `
        --environment $ENVIRONMENT `
        --image "$ACR_NAME.azurecr.io/ppp-evaluaciones:latest" `
        --target-port 3004 `
        --ingress internal `
        --registry-server "$ACR_NAME.azurecr.io" `
        --registry-username $ACR_USERNAME `
        --registry-password "$ACR_PASSWORD" `
        --env-vars-file env-evaluaciones.json `
        --cpu 0.5 `
        --memory 1Gi `
        --min-replicas 1 `
        --max-replicas 3
}
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK ppp-evaluaciones-service" -ForegroundColor Green
} else {
    Write-Host "ERROR: Deploy fallido" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 5. ppaz-api-gateway
Write-Host "[5/5] Actualizando ppaz-api-gateway..." -ForegroundColor Cyan
az containerapp update `
    --name ppaz-api-gateway `
    --resource-group $RESOURCE_GROUP `
    --image "$ACR_NAME.azurecr.io/ppaz-gateway:latest" `
    --replace-env-vars-file env-gateway.json
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK ppaz-api-gateway" -ForegroundColor Green
} else {
    Write-Host "ERROR: Update fallido" -ForegroundColor Red
    exit 1
}
Write-Host ""

# VERIFICAR DESPLIEGUE
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "VERIFICANDO DESPLIEGUE" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$GATEWAY_URL = (az containerapp show --name ppaz-api-gateway --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)

Write-Host ""
Write-Host "DESPLIEGUE COMPLETADO!" -ForegroundColor Green
Write-Host ""
Write-Host "URL PUBLICA:" -ForegroundColor Cyan
Write-Host "  API Gateway: https://$GATEWAY_URL" -ForegroundColor Green
Write-Host "  Swagger UI:  https://$GATEWAY_URL/api/docs" -ForegroundColor Green
Write-Host "  Health Check: https://$GATEWAY_URL/health" -ForegroundColor Green
Write-Host ""
Write-Host "Prueba tu API en: https://$GATEWAY_URL/api/docs" -ForegroundColor Yellow
Write-Host ""
