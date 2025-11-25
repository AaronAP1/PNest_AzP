# Script para actualizar solo las variables de entorno
$ErrorActionPreference = "Continue"

$RESOURCE_GROUP = "ppp-brazil-rg"
$deployConfig = Get-Content "deployment-config.json" | ConvertFrom-Json
$DB_HOST = $deployConfig.DbHost
$DB_USER = $deployConfig.DbUser
$DB_PASSWORD = $deployConfig.DbPassword

Write-Host "`nActualizando variables de entorno..." -ForegroundColor Yellow

# Auth
Write-Host "  Actualizando ppp-auth..." -ForegroundColor Cyan
az containerapp update `
    --name ppp-auth `
    --resource-group $RESOURCE_GROUP `
    --set-env-vars "DATABASE_URL_CORE=postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:5432/ppp_auth?schema=public&sslmode=require" "JWT_SECRET=ppp-nest-production-jwt-secret-2024-change-this-in-production" "JWT_EXPIRATION=24h" "BCRYPT_ROUNDS=10" "APP_NAME=ppp_auth_service" "PORT=3001" "NODE_ENV=production" `
    --output none

# Core
Write-Host "  Actualizando ppp-core..." -ForegroundColor Cyan
az containerapp update `
    --name ppp-core `
    --resource-group $RESOURCE_GROUP `
    --set-env-vars "DATABASE_URL_CORE=postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:5432/ppp_core?schema=public&sslmode=require" "DATABASE_URL_ACADEMIC=postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:5432/ppp_core?schema=public&sslmode=require" "APP_NAME=ppp_core" "PORT=3002" "NODE_ENV=production" `
    --output none

# Companias
Write-Host "  Actualizando ppp-companias..." -ForegroundColor Cyan
az containerapp update `
    --name ppp-companias `
    --resource-group $RESOURCE_GROUP `
    --set-env-vars "DATABASE_URL_COMPANIAS=postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:5432/ppp_companias?schema=public&sslmode=require" "DATABASE_URL_CORE=postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:5432/ppp_core?schema=public&sslmode=require" "APP_NAME=ppp_companias" "PORT=3003" "NODE_ENV=production" "CORE_SERVICE_URL=http://ppp-core" `
    --output none

# Evaluaciones
Write-Host "  Actualizando ppp-evaluaciones..." -ForegroundColor Cyan
az containerapp update `
    --name ppp-evaluaciones `
    --resource-group $RESOURCE_GROUP `
    --set-env-vars "DATABASE_URL_CORE=postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:5432/ppp_evaluaciones?schema=public&sslmode=require" "APP_NAME=ppp_evaluaciones_service" "PORT=3004" "NODE_ENV=production" `
    --output none

# Gateway
Write-Host "  Actualizando ppp-gateway..." -ForegroundColor Cyan
az containerapp update `
    --name ppp-gateway `
    --resource-group $RESOURCE_GROUP `
    --set-env-vars "DATABASE_URL_CORE=postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:5432/ppp_core?schema=public&sslmode=require" "DATABASE_URL_COMPANIAS=postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:5432/ppp_companias?schema=public&sslmode=require" "APP_NAME=ppaz_api_gateway" "PORT=3000" "NODE_ENV=production" "PPP_CORE_HOST=ppp-core" "PPP_CORE_PORT=443" "PPP_COMPANIAS_HOST=ppp-companias" "PPP_COMPANIAS_PORT=443" "PPP_AUTH_HOST=ppp-auth" "PPP_AUTH_PORT=443" "PPP_EVALUACIONES_HOST=ppp-evaluaciones" "PPP_EVALUACIONES_PORT=443" "JWT_SECRET=ppp-nest-production-jwt-secret-2024-change-this-in-production" "JWT_EXPIRATION=24h" `
    --output none

Write-Host "`nListo! Probando URLs..." -ForegroundColor Green
Write-Host "  Gateway:  https://ppp-gateway.calmplant-63fb30e9.brazilsouth.azurecontainerapps.io" -ForegroundColor White
Write-Host "  Health:   https://ppp-gateway.calmplant-63fb30e9.brazilsouth.azurecontainerapps.io/health" -ForegroundColor White
Write-Host "  Swagger:  https://ppp-gateway.calmplant-63fb30e9.brazilsouth.azurecontainerapps.io/api" -ForegroundColor White
