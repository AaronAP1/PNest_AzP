#!/usr/bin/env pwsh
# Script para redesplegar un servicio específico a Azure Container Apps
# Uso: .\redeploy-service.ps1 -ServiceName <nombre-servicio>
# Ejemplo: .\redeploy-service.ps1 -ServiceName gateway

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('auth', 'core', 'companias', 'evaluaciones', 'gateway')]
    [string]$ServiceName
)

$ErrorActionPreference = "Stop"

# Configuración
$REGISTRY = "pppcontainersregistry01.azurecr.io"
$RESOURCE_GROUP = "ppp-brazil-rg"

# Mapeo de nombres de servicios a imágenes y apps
$serviceConfig = @{
    'auth' = @{
        ImageName = 'ppp-auth-service'
        AppName = 'ppp-auth'
        Dockerfile = 'apps/ppp-auth-service/Dockerfile'
    }
    'core' = @{
        ImageName = 'ppp-core'
        AppName = 'ppp-core'
        Dockerfile = 'apps/ppp_core/Dockerfile'
    }
    'companias' = @{
        ImageName = 'ppp-companias'
        AppName = 'ppp-companias'
        Dockerfile = 'apps/ppp_companias/Dockerfile'
    }
    'evaluaciones' = @{
        ImageName = 'ppp-evaluaciones-service'
        AppName = 'ppp-evaluaciones'
        Dockerfile = 'apps/ppp-evaluaciones-service/Dockerfile'
    }
    'gateway' = @{
        ImageName = 'ppp-gateway'
        AppName = 'ppp-gateway'
        Dockerfile = 'apps/ppaz-api-gateway/Dockerfile'
    }
}

$config = $serviceConfig[$ServiceName]
$IMAGE_NAME = $config.ImageName
$APP_NAME = $config.AppName
$DOCKERFILE = $config.Dockerfile
$FULL_IMAGE = "$REGISTRY/${IMAGE_NAME}:latest"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Redespliegue de servicio: $ServiceName" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Construir imagen
Write-Host "[1/4] Construyendo imagen Docker sin cache..." -ForegroundColor Yellow
Write-Host "      Imagen: $FULL_IMAGE" -ForegroundColor Gray
Write-Host "      Dockerfile: $DOCKERFILE" -ForegroundColor Gray
docker build --no-cache -t $FULL_IMAGE -f $DOCKERFILE .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al construir la imagen" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Imagen construida exitosamente" -ForegroundColor Green
Write-Host ""

# Paso 2: Push a Azure Container Registry
Write-Host "[2/4] Subiendo imagen a Azure Container Registry..." -ForegroundColor Yellow
docker push $FULL_IMAGE
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al subir la imagen" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Imagen subida exitosamente" -ForegroundColor Green
Write-Host ""

# Paso 3: Actualizar Container App
Write-Host "[3/4] Actualizando Azure Container App: $APP_NAME..." -ForegroundColor Yellow
az containerapp update `
    --name $APP_NAME `
    --resource-group $RESOURCE_GROUP `
    --image $FULL_IMAGE `
    --output none
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al actualizar Container App" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Container App actualizado" -ForegroundColor Green
Write-Host ""

# Paso 4: Reiniciar el servicio
Write-Host "[4/4] Reiniciando el servicio..." -ForegroundColor Yellow
$revisions = az containerapp revision list `
    --name $APP_NAME `
    --resource-group $RESOURCE_GROUP `
    --query "[?properties.active==``true``].name" `
    --output tsv

if ($revisions) {
    $latestRevision = $revisions | Select-Object -First 1
    Write-Host "      Reiniciando revisión: $latestRevision" -ForegroundColor Gray
    az containerapp revision restart `
        --name $APP_NAME `
        --resource-group $RESOURCE_GROUP `
        --revision $latestRevision `
        --output none
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Advertencia: No se pudo reiniciar la revisión" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Servicio reiniciado" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  No se encontró revisión activa para reiniciar" -ForegroundColor Yellow
}
Write-Host ""

# Resumen
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  ✅ Redespliegue completado exitosamente" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Servicio: $ServiceName ($APP_NAME)" -ForegroundColor White
Write-Host "Imagen: $FULL_IMAGE" -ForegroundColor White
Write-Host ""
Write-Host "Para ver los logs:" -ForegroundColor Yellow
Write-Host "  az containerapp logs show --name $APP_NAME --resource-group $RESOURCE_GROUP --follow" -ForegroundColor Gray
Write-Host ""
