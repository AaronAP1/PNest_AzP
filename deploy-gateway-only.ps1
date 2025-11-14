# Script simplificado para desplegar solo ppaz-api-gateway

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "DESPLIEGUE DE API GATEWAY" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$RESOURCE_GROUP = "rg-ppp-microservices"
$ACR_NAME = "acrpppnest3008"
$IMAGE_NAME = "ppaz-gateway"
$CONTAINER_APP = "ppaz-api-gateway"
$VERSION = Get-Date -Format 'yyyyMMddHHmmss'

Write-Host "1️⃣ Login a Azure Container Registry..." -ForegroundColor Yellow
az acr login --name $ACR_NAME

Write-Host ""
Write-Host "2️⃣ Construyendo imagen Docker..." -ForegroundColor Yellow
docker build --no-cache -t "$ACR_NAME.azurecr.io/$IMAGE_NAME:v$VERSION" -f apps/ppaz-api-gateway/Dockerfile .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al construir la imagen" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "3️⃣ Subiendo imagen a ACR..." -ForegroundColor Yellow
docker push "$ACR_NAME.azurecr.io/$IMAGE_NAME:v$VERSION"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al subir la imagen" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "4️⃣ Actualizando Container App..." -ForegroundColor Yellow
az containerapp update `
    --name $CONTAINER_APP `
    --resource-group $RESOURCE_GROUP `
    --image "$ACR_NAME.azurecr.io/$IMAGE_NAME:v$VERSION"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "✅ DESPLIEGUE COMPLETADO" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "El API Gateway estará disponible en unos segundos." -ForegroundColor Cyan
    Write-Host "Version desplegada: v$VERSION" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Error al actualizar Container App" -ForegroundColor Red
    exit 1
}
