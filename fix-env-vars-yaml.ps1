# Script para actualizar variables de entorno usando archivos YAML
$ErrorActionPreference = "Stop"

$RESOURCE_GROUP = "ppp-brazil-rg"
$deployConfig = Get-Content "deployment-config.json" | ConvertFrom-Json
$DB_HOST = $deployConfig.DbHost
$DB_USER = $deployConfig.DbUser
$DB_PASSWORD = $deployConfig.DbPassword

Write-Host "`nActualizando variables de entorno con YAML..." -ForegroundColor Yellow

# Construir URLs de conexión (con & escapado)
$authUrl = "postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:5432/ppp_auth?schema=public`&sslmode=require"
$coreUrl = "postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:5432/ppp_core?schema=public`&sslmode=require"
$companiasUrl = "postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:5432/ppp_companias?schema=public`&sslmode=require"
$evaluacionesUrl = "postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:5432/ppp_evaluaciones?schema=public`&sslmode=require"

# Función para crear archivo YAML y actualizar
function Update-ContainerAppEnv {
    param(
        [string]$AppName,
        [hashtable]$EnvVars
    )
    
    Write-Host "  Actualizando $AppName..." -ForegroundColor Cyan
    
    # Crear archivo YAML temporal
    $yamlFile = "temp-$AppName.yaml"
    $yamlContent = @"
properties:
  template:
    containers:
    - name: $AppName
      env:
"@
    
    foreach ($key in $EnvVars.Keys) {
        $value = $EnvVars[$key]
        $yamlContent += @"

      - name: $key
        value: "$value"
"@
    }
    
    Set-Content -Path $yamlFile -Value $yamlContent -Encoding UTF8
    
    # Actualizar Container App
    az containerapp update `
        --name $AppName `
        --resource-group $RESOURCE_GROUP `
        --yaml $yamlFile `
        --output none
    
    # Limpiar archivo temporal
    Remove-Item $yamlFile -Force
    
    Write-Host "    ✓ $AppName actualizado" -ForegroundColor Green
}

# Auth Service
$authEnvs = @{
    "DATABASE_URL_CORE" = $authUrl
    "JWT_SECRET" = "ppp-nest-production-jwt-secret-2024-change-this-in-production"
    "JWT_EXPIRATION" = "24h"
    "BCRYPT_ROUNDS" = "10"
    "APP_NAME" = "ppp_auth_service"
    "PORT" = "3001"
    "NODE_ENV" = "production"
}
Update-ContainerAppEnv -AppName "ppp-auth" -EnvVars $authEnvs

# Core Service
$coreEnvs = @{
    "DATABASE_URL_CORE" = $coreUrl
    "DATABASE_URL_ACADEMIC" = $coreUrl
    "APP_NAME" = "ppp_core"
    "PORT" = "3002"
    "NODE_ENV" = "production"
}
Update-ContainerAppEnv -AppName "ppp-core" -EnvVars $coreEnvs

# Companias Service
$companiasEnvs = @{
    "DATABASE_URL_COMPANIAS" = $companiasUrl
    "DATABASE_URL_CORE" = $coreUrl
    "APP_NAME" = "ppp_companias"
    "PORT" = "3003"
    "NODE_ENV" = "production"
    "CORE_SERVICE_URL" = "http://ppp-core"
}
Update-ContainerAppEnv -AppName "ppp-companias" -EnvVars $companiasEnvs

# Evaluaciones Service
$evaluacionesEnvs = @{
    "DATABASE_URL_CORE" = $evaluacionesUrl
    "APP_NAME" = "ppp_evaluaciones_service"
    "PORT" = "3004"
    "NODE_ENV" = "production"
}
Update-ContainerAppEnv -AppName "ppp-evaluaciones" -EnvVars $evaluacionesEnvs

# Gateway Service
$gatewayEnvs = @{
    "DATABASE_URL_CORE" = $coreUrl
    "DATABASE_URL_COMPANIAS" = $companiasUrl
    "APP_NAME" = "ppaz_api_gateway"
    "PORT" = "3000"
    "NODE_ENV" = "production"
    "PPP_CORE_HOST" = "ppp-core"
    "PPP_CORE_PORT" = "443"
    "PPP_COMPANIAS_HOST" = "ppp-companias"
    "PPP_COMPANIAS_PORT" = "443"
    "PPP_AUTH_HOST" = "ppp-auth"
    "PPP_AUTH_PORT" = "443"
    "PPP_EVALUACIONES_HOST" = "ppp-evaluaciones"
    "PPP_EVALUACIONES_PORT" = "443"
    "JWT_SECRET" = "ppp-nest-production-jwt-secret-2024-change-this-in-production"
    "JWT_EXPIRATION" = "24h"
}
Update-ContainerAppEnv -AppName "ppp-gateway" -EnvVars $gatewayEnvs

Write-Host "`n✓ Todas las variables de entorno actualizadas correctamente!" -ForegroundColor Green
Write-Host "`nProbando URLs..." -ForegroundColor Yellow
Write-Host "  Gateway:  https://ppp-gateway.calmplant-63fb30e9.brazilsouth.azurecontainerapps.io" -ForegroundColor White
Write-Host "  Health:   https://ppp-gateway.calmplant-63fb30e9.brazilsouth.azurecontainerapps.io/health" -ForegroundColor White
Write-Host "  Swagger:  https://ppp-gateway.calmplant-63fb30e9.brazilsouth.azurecontainerapps.io/api" -ForegroundColor White
