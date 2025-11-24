# Script simple para actualizar variables de entorno
$ErrorActionPreference = "Continue"

$RESOURCE_GROUP = "ppp-brazil-rg"
$deployConfig = Get-Content "deployment-config.json" | ConvertFrom-Json
$DB_HOST = $deployConfig.DbHost
$DB_USER = $deployConfig.DbUser
$DB_PASSWORD = $deployConfig.DbPassword

Write-Host "`nActualizando variables de entorno..." -ForegroundColor Yellow

# ppp-auth
Write-Host "  Actualizando ppp-auth..." -ForegroundColor Cyan
$env1 = 'DATABASE_URL_CORE=postgresql://' + $DB_USER + ':' + $DB_PASSWORD + '@' + $DB_HOST + ':5432/ppp_auth?schema=public&sslmode=require'
$env2 = "JWT_SECRET=ppp-nest-production-jwt-secret-2024-change-this-in-production"
$env3 = "JWT_EXPIRATION=24h"
$env4 = "BCRYPT_ROUNDS=10"
$env5 = "APP_NAME=ppp_auth_service"
$env6 = "PORT=3001"
$env7 = "NODE_ENV=production"
az containerapp update --name ppp-auth --resource-group $RESOURCE_GROUP --set-env-vars "$env1" "$env2" "$env3" "$env4" "$env5" "$env6" "$env7" --output none
Write-Host "    ✓ ppp-auth actualizado" -ForegroundColor Green

# ppp-core
Write-Host "  Actualizando ppp-core..." -ForegroundColor Cyan
$env1 = 'DATABASE_URL_CORE=postgresql://' + $DB_USER + ':' + $DB_PASSWORD + '@' + $DB_HOST + ':5432/ppp_core?schema=public&sslmode=require'
$env2 = 'DATABASE_URL_ACADEMIC=postgresql://' + $DB_USER + ':' + $DB_PASSWORD + '@' + $DB_HOST + ':5432/ppp_core?schema=public&sslmode=require'
$env3 = "APP_NAME=ppp_core"
$env4 = "PORT=3002"
$env5 = "NODE_ENV=production"
az containerapp update --name ppp-core --resource-group $RESOURCE_GROUP --set-env-vars "$env1" "$env2" "$env3" "$env4" "$env5" --output none
Write-Host "    ✓ ppp-core actualizado" -ForegroundColor Green

# ppp-companias
Write-Host "  Actualizando ppp-companias..." -ForegroundColor Cyan
$env1 = 'DATABASE_URL_COMPANIAS=postgresql://' + $DB_USER + ':' + $DB_PASSWORD + '@' + $DB_HOST + ':5432/ppp_companias?schema=public&sslmode=require'
$env2 = 'DATABASE_URL_CORE=postgresql://' + $DB_USER + ':' + $DB_PASSWORD + '@' + $DB_HOST + ':5432/ppp_core?schema=public&sslmode=require'
$env3 = "APP_NAME=ppp_companias"
$env4 = "PORT=3003"
$env5 = "NODE_ENV=production"
$env6 = "CORE_SERVICE_URL=http://ppp-core"
az containerapp update --name ppp-companias --resource-group $RESOURCE_GROUP --set-env-vars "$env1" "$env2" "$env3" "$env4" "$env5" "$env6" --output none
Write-Host "    ✓ ppp-companias actualizado" -ForegroundColor Green

# ppp-evaluaciones
Write-Host "  Actualizando ppp-evaluaciones..." -ForegroundColor Cyan
$env1 = 'DATABASE_URL_CORE=postgresql://' + $DB_USER + ':' + $DB_PASSWORD + '@' + $DB_HOST + ':5432/ppp_evaluaciones?schema=public&sslmode=require'
$env2 = "APP_NAME=ppp_evaluaciones_service"
$env3 = "PORT=3004"
$env4 = "NODE_ENV=production"
az containerapp update --name ppp-evaluaciones --resource-group $RESOURCE_GROUP --set-env-vars "$env1" "$env2" "$env3" "$env4" --output none
Write-Host "    ✓ ppp-evaluaciones actualizado" -ForegroundColor Green

# ppp-gateway
Write-Host "  Actualizando ppp-gateway..." -ForegroundColor Cyan
$env1 = 'DATABASE_URL_CORE=postgresql://' + $DB_USER + ':' + $DB_PASSWORD + '@' + $DB_HOST + ':5432/ppp_core?schema=public&sslmode=require'
$env2 = 'DATABASE_URL_COMPANIAS=postgresql://' + $DB_USER + ':' + $DB_PASSWORD + '@' + $DB_HOST + ':5432/ppp_companias?schema=public&sslmode=require'
$env3 = "APP_NAME=ppaz_api_gateway"
$env4 = "PORT=3000"
$env5 = "NODE_ENV=production"
$env6 = "PPP_CORE_HOST=ppp-core"
$env7 = "PPP_CORE_PORT=443"
$env8 = "PPP_COMPANIAS_HOST=ppp-companias"
$env9 = "PPP_COMPANIAS_PORT=443"
$env10 = "PPP_AUTH_HOST=ppp-auth"
$env11 = "PPP_AUTH_PORT=443"
$env12 = "PPP_EVALUACIONES_HOST=ppp-evaluaciones"
$env13 = "PPP_EVALUACIONES_PORT=443"
$env14 = "JWT_SECRET=ppp-nest-production-jwt-secret-2024-change-this-in-production"
$env15 = "JWT_EXPIRATION=24h"
az containerapp update --name ppp-gateway --resource-group $RESOURCE_GROUP --set-env-vars "$env1" "$env2" "$env3" "$env4" "$env5" "$env6" "$env7" "$env8" "$env9" "$env10" "$env11" "$env12" "$env13" "$env14" "$env15" --output none
Write-Host "    ✓ ppp-gateway actualizado" -ForegroundColor Green

Write-Host "`n✓ Todas las variables actualizadas!" -ForegroundColor Green
Write-Host "`nURLs de prueba:" -ForegroundColor Yellow
Write-Host "  Gateway:  https://ppp-gateway.calmplant-63fb30e9.brazilsouth.azurecontainerapps.io" -ForegroundColor White
Write-Host "  Health:   https://ppp-gateway.calmplant-63fb30e9.brazilsouth.azurecontainerapps.io/health" -ForegroundColor White
Write-Host "  Swagger:  https://ppp-gateway.calmplant-63fb30e9.brazilsouth.azurecontainerapps.io/api" -ForegroundColor White
