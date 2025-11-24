# Script para desplegar en Brazil South
$ErrorActionPreference = "Continue"  # Cambiar a Continue para ignorar warnings

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "  DESPLIEGUE BRAZIL SOUTH" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Configuracion
$LOCATION = "brazilsouth"
$RESOURCE_GROUP = "ppp-brazil-rg"
$ENVIRONMENT = "ppp-brazil-env"
$ACR_NAME = "pppcontainersregistry01"

# Obtener credenciales de BD
Write-Host "`nObteniendo credenciales..." -ForegroundColor Yellow
$deployConfig = Get-Content "deployment-config.json" | ConvertFrom-Json
$DB_HOST = $deployConfig.DbHost
$DB_USER = $deployConfig.DbUser
$DB_PASSWORD = $deployConfig.DbPassword

Write-Host "BD: $DB_USER @ $DB_HOST" -ForegroundColor Green

# Obtener credenciales de ACR
$ACR_SERVER = "$ACR_NAME.azurecr.io"
$ACR_USERNAME = az acr credential show --name $ACR_NAME --query "username" --output tsv
$ACR_PASSWORD_ACR = az acr credential show --name $ACR_NAME --query "passwords[0].value" --output tsv

if (-not $ACR_PASSWORD_ACR) {
    Write-Host "Error obteniendo password ACR" -ForegroundColor Red
    exit 1
}

# Construir URLs de BD
$dbUrlCore = "postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:5432/ppp_core?schema=public&sslmode=require"
$dbUrlAuth = "postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:5432/ppp_auth?schema=public&sslmode=require"
$dbUrlCompanias = "postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:5432/ppp_companias?schema=public&sslmode=require"
$dbUrlEvaluaciones = "postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:5432/ppp_evaluaciones?schema=public&sslmode=require"

# Configuraciones de servicios
$envGateway = @(
    @{ name = "DATABASE_URL_CORE"; value = $dbUrlCore }
    @{ name = "DATABASE_URL_COMPANIAS"; value = $dbUrlCompanias }
    @{ name = "APP_NAME"; value = "ppaz_api_gateway" }
    @{ name = "PORT"; value = "3000" }
    @{ name = "HOST"; value = "0.0.0.0" }
    @{ name = "NODE_ENV"; value = "production" }
    @{ name = "LOG_LEVEL"; value = "info" }
    @{ name = "PPP_CORE_HOST"; value = "ppp-core" }
    @{ name = "PPP_CORE_PORT"; value = "443" }
    @{ name = "PPP_COMPANIAS_HOST"; value = "ppp-companias" }
    @{ name = "PPP_COMPANIAS_PORT"; value = "443" }
    @{ name = "PPP_AUTH_HOST"; value = "ppp-auth" }
    @{ name = "PPP_AUTH_PORT"; value = "443" }
    @{ name = "PPP_EVALUACIONES_HOST"; value = "ppp-evaluaciones" }
    @{ name = "PPP_EVALUACIONES_PORT"; value = "443" }
    @{ name = "SWAGGER_TITLE"; value = "PPP API Gateway - Brazil" }
    @{ name = "SWAGGER_VERSION"; value = "1.0" }
    @{ name = "JWT_SECRET"; value = "ppp-nest-production-jwt-secret-2024-change-this-in-production" }
    @{ name = "JWT_EXPIRATION"; value = "24h" }
)

$envAuth = @(
    @{ name = "DATABASE_URL_CORE"; value = $dbUrlAuth }
    @{ name = "APP_NAME"; value = "ppp_auth_service" }
    @{ name = "PORT"; value = "3001" }
    @{ name = "HOST"; value = "0.0.0.0" }
    @{ name = "NODE_ENV"; value = "production" }
    @{ name = "JWT_SECRET"; value = "ppp-nest-production-jwt-secret-2024-change-this-in-production" }
    @{ name = "JWT_EXPIRATION"; value = "24h" }
    @{ name = "BCRYPT_ROUNDS"; value = "10" }
)

$envCore = @(
    @{ name = "DATABASE_URL_CORE"; value = $dbUrlCore }
    @{ name = "DATABASE_URL_ACADEMIC"; value = $dbUrlCore }
    @{ name = "APP_NAME"; value = "ppp_core" }
    @{ name = "PORT"; value = "3002" }
    @{ name = "HOST"; value = "0.0.0.0" }
    @{ name = "NODE_ENV"; value = "production" }
)

$envCompanias = @(
    @{ name = "DATABASE_URL_COMPANIAS"; value = $dbUrlCompanias }
    @{ name = "DATABASE_URL_CORE"; value = $dbUrlCore }
    @{ name = "APP_NAME"; value = "ppp_companias" }
    @{ name = "PORT"; value = "3003" }
    @{ name = "HOST"; value = "0.0.0.0" }
    @{ name = "NODE_ENV"; value = "production" }
    @{ name = "CORE_SERVICE_URL"; value = "http://ppp-core" }
)

$envEvaluaciones = @(
    @{ name = "DATABASE_URL_CORE"; value = $dbUrlEvaluaciones }
    @{ name = "APP_NAME"; value = "ppp_evaluaciones_service" }
    @{ name = "PORT"; value = "3004" }
    @{ name = "HOST"; value = "0.0.0.0" }
    @{ name = "NODE_ENV"; value = "production" }
)

$services = @{
    "ppp-gateway" = @{
        Image = "ppaz-api-gateway:latest"
        Dockerfile = "apps/ppaz-api-gateway/Dockerfile"
        Port = 3000
        External = $true
        EnvFile = $envGateway
    }
    "ppp-auth" = @{
        Image = "ppp-auth-service:latest"
        Dockerfile = "apps/ppp-auth-service/Dockerfile"
        Port = 3001
        External = $false
        EnvFile = $envAuth
    }
    "ppp-core" = @{
        Image = "ppp-core:latest"
        Dockerfile = "apps/ppp_core/Dockerfile"
        Port = 3002
        External = $false
        EnvFile = $envCore
    }
    "ppp-companias" = @{
        Image = "ppp-companias:latest"
        Dockerfile = "apps/ppp_companias/Dockerfile"
        Port = 3003
        External = $false
        EnvFile = $envCompanias
    }
    "ppp-evaluaciones" = @{
        Image = "ppp-evaluaciones-service:latest"
        Dockerfile = "apps/ppp-evaluaciones-service/Dockerfile"
        Port = 3004
        External = $false
        EnvFile = $envEvaluaciones
    }
}

# PASO 1: Crear Resource Group
Write-Host "`n[1/4] Creando Resource Group..." -ForegroundColor Yellow
$rgExists = az group exists --name $RESOURCE_GROUP
if ($rgExists -eq "true") {
    Write-Host "Ya existe" -ForegroundColor Green
} else {
    az group create --name $RESOURCE_GROUP --location $LOCATION --output none
    Write-Host "Creado" -ForegroundColor Green
}

# PASO 2: Crear Container App Environment
Write-Host "`n[2/4] Creando Environment..." -ForegroundColor Yellow
az containerapp env create --name $ENVIRONMENT --resource-group $RESOURCE_GROUP --location $LOCATION --output none 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Creado" -ForegroundColor Green
} else {
    Write-Host "Ya existe o creado" -ForegroundColor Green
}

# PASO 3: Build y Push
Write-Host "`n[3/4] Building imagenes..." -ForegroundColor Yellow
az acr login --name $ACR_NAME | Out-Null

foreach ($serviceName in $services.Keys) {
    $service = $services[$serviceName]
    $fullImage = "$ACR_SERVER/$($service.Image)"
    
    Write-Host "  Building $serviceName..." -ForegroundColor Cyan
    docker build -t $fullImage -f $service.Dockerfile . --quiet
    docker push $fullImage --quiet
    Write-Host "  Listo" -ForegroundColor Green
}

# PASO 4: Desplegar Container Apps
Write-Host "`n[4/4] Desplegando servicios..." -ForegroundColor Yellow

foreach ($serviceName in $services.Keys) {
    $service = $services[$serviceName]
    $fullImage = "$ACR_SERVER/$($service.Image)"
    
    Write-Host "  Desplegando $serviceName..." -ForegroundColor Cyan
    
    $envArgs = @()
    foreach ($envVar in $service.EnvFile) {
        $envArgs += "--env-vars"
        $envArgs += "$($envVar.name)=$($envVar.value)"
    }
    
    $ingressType = if ($service.External) { "external" } else { "internal" }
    
    az containerapp create `
        --name $serviceName `
        --resource-group $RESOURCE_GROUP `
        --environment $ENVIRONMENT `
        --image $fullImage `
        --target-port $service.Port `
        --ingress $ingressType `
        --registry-server $ACR_SERVER `
        --registry-username $ACR_USERNAME `
        --registry-password $ACR_PASSWORD_ACR `
        --cpu 0.5 `
        --memory 1.0Gi `
        --min-replicas 1 `
        --max-replicas 3 `
        @envArgs `
        --output none 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Listo" -ForegroundColor Green
    } else {
        Write-Host "  Actualizando existente..." -ForegroundColor Gray
        az containerapp update --name $serviceName --resource-group $RESOURCE_GROUP --image $fullImage @envArgs --output none
        Write-Host "  Listo" -ForegroundColor Green
    }
}

# Obtener URL del Gateway
Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "  DESPLIEGUE COMPLETADO" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$gatewayFqdn = az containerapp show --name "ppp-gateway" --resource-group $RESOURCE_GROUP --query "properties.configuration.ingress.fqdn" --output tsv

if ($gatewayFqdn) {
    Write-Host "`nURLs:" -ForegroundColor Green
    Write-Host "  Gateway:  https://$gatewayFqdn" -ForegroundColor White
    Write-Host "  Health:   https://$gatewayFqdn/health" -ForegroundColor White
    Write-Host "  Swagger:  https://$gatewayFqdn/api" -ForegroundColor White
    
    $endpoints = @{
        Location = "Brazil South"
        Gateway = "https://$gatewayFqdn"
        Health = "https://$gatewayFqdn/health"
        Swagger = "https://$gatewayFqdn/api"
    }
    
    $endpoints | ConvertTo-Json | Out-File "deployment-endpoints-brazil.json" -Encoding UTF8
    Write-Host "`nGuardado en: deployment-endpoints-brazil.json" -ForegroundColor Cyan
}

Write-Host ""
