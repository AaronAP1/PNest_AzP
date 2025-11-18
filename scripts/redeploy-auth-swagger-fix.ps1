# ============================================================
# SCRIPT: Redesplegar Auth Service con Swagger corregido
# ============================================================
# Corrige documentación Swagger para mostrar correctamente
# la relación many-to-many entre Usuario y Rol
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  🔧 REDESPLIEGUE AUTH SERVICE - SWAGGER FIX" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

# Variables
$ACR_NAME = "acrpppnest3008"
$IMAGE_NAME = "ppp-auth-service"
$TAG = "latest"
$RESOURCE_GROUP = "rg-ppp-microservices"
$CONTAINER_APP = "ppp-auth-service"

Write-Host "📦 [1/4] Building Auth Service con DTOs corregidos..." -ForegroundColor Yellow
docker build -t acrpppnest3008.azurecr.io/ppp-auth-service:latest -f apps/ppp-auth-service/Dockerfile .

if ($LASTEXITCODE -ne 0) {
  Write-Host "`n❌ Error en build" -ForegroundColor Red
  exit 1
}

Write-Host "`n✅ Build completado" -ForegroundColor Green

Write-Host "`n🔐 [2/4] Autenticando en ACR..." -ForegroundColor Yellow
az acr login --name acrpppnest3008

if ($LASTEXITCODE -ne 0) {
  Write-Host "`n❌ Error en autenticación ACR" -ForegroundColor Red
  exit 1
}

Write-Host "`n⬆️  [3/4] Subiendo imagen a ACR..." -ForegroundColor Yellow
docker push acrpppnest3008.azurecr.io/ppp-auth-service:latest

if ($LASTEXITCODE -ne 0) {
  Write-Host "`n❌ Error al subir imagen" -ForegroundColor Red
  exit 1
}

Write-Host "`n✅ Imagen subida exitosamente" -ForegroundColor Green

Write-Host "`n🚀 [4/4] Actualizando Container App..." -ForegroundColor Yellow
$revision = az containerapp update `
  --name ppp-auth-service `
  --resource-group rg-ppp-microservices `
  --image acrpppnest3008.azurecr.io/ppp-auth-service:latest `
  --query "properties.latestRevisionName" `
  --output tsv

if ($LASTEXITCODE -ne 0) {
  Write-Host "`n❌ Error al actualizar Container App" -ForegroundColor Red
  exit 1
}

Write-Host "`n✅ Container App actualizado: $revision" -ForegroundColor Green

Write-Host "`n⏳ Esperando 20 segundos para que el servicio esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  ✅ REDESPLIEGUE COMPLETADO" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "📝 Cambios aplicados:" -ForegroundColor White
Write-Host "  • DTOs con @ApiProperty para documentación" -ForegroundColor Gray
Write-Host "  • UsuarioResponseDto muestra estructura correcta" -ForegroundColor Gray
Write-Host "  • Campo 'roles' es array de relaciones many-to-many" -ForegroundColor Gray
Write-Host "  • NO existe campo 'id_rol' en usuario" -ForegroundColor Gray

Write-Host "`n🌐 Swagger UI disponible en:" -ForegroundColor Cyan
Write-Host "  https://ppaz-api-gateway.whitesand-5e7ae56f.brazilsouth.azurecontainerapps.io/docs`n" -ForegroundColor White

Write-Host "💡 TIP: Revisa la documentación del endpoint POST /usuarios" -ForegroundColor Yellow
Write-Host "    El campo 'rolesIds' permite asignar múltiples roles`n" -ForegroundColor Gray
