# Script para actualizar todos los microservicios en Azure Container Apps
# Actualiza Gateway, Auth, Core, Companias y Evaluaciones

$ErrorActionPreference = "Stop"

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "  ACTUALIZACION COMPLETA DE MICROSERVICIOS" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# Variables
$ACR_NAME = "pppcontainersregistry01"
$RESOURCE_GROUP = "ppp-containers-rg"

# Servicios a actualizar (imagen => nombre-containerapp)
$services = @{
    "ppaz-api-gateway" = @{ Dockerfile = "apps/ppaz-api-gateway/Dockerfile"; AppName = "ppp-gateway" }
    "ppp-auth-service" = @{ Dockerfile = "apps/ppp-auth-service/Dockerfile"; AppName = "ppp-auth" }
    "ppp-core" = @{ Dockerfile = "apps/ppp_core/Dockerfile"; AppName = "ppp-core" }
    "ppp-companias" = @{ Dockerfile = "apps/ppp_companias/Dockerfile"; AppName = "ppp-companias" }
    "ppp-evaluaciones" = @{ Dockerfile = "apps/ppp-evaluaciones-service/Dockerfile"; AppName = "ppp-evaluaciones" }
}

Write-Host "Servicios a actualizar:" -ForegroundColor Yellow
foreach ($service in $services.Keys) {
    Write-Host "  - $service" -ForegroundColor Gray
}
Write-Host ""

# Autenticar en ACR
Write-Host "Autenticando en Azure Container Registry..." -ForegroundColor Yellow
az acr login --name $ACR_NAME

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nError en autenticacion ACR" -ForegroundColor Red
    exit 1
}
Write-Host "Autenticado en ACR`n" -ForegroundColor Green

$successCount = 0
$failedServices = @()

# Procesar cada servicio
foreach ($service in $services.Keys) {
    $dockerfile = $services[$service].Dockerfile
    $imageName = "${ACR_NAME}.azurecr.io/${service}:latest"
    
    Write-Host "===============================================" -ForegroundColor DarkCyan
    Write-Host "Procesando: $service" -ForegroundColor Cyan
    Write-Host "===============================================" -ForegroundColor DarkCyan
    
    try {
        # BUILD
        Write-Host "`n[1/3] Building imagen..." -ForegroundColor Yellow
        docker build -t $imageName -f $dockerfile .
        
        if ($LASTEXITCODE -ne 0) {
            throw "Error en build de $service"
        }
        Write-Host "Build completado" -ForegroundColor Green
        
        # PUSH
        Write-Host "`n[2/3] Subiendo imagen a ACR..." -ForegroundColor Yellow
        docker push $imageName
        
        if ($LASTEXITCODE -ne 0) {
            throw "Error al subir imagen de $service"
        }
        Write-Host "Imagen subida" -ForegroundColor Green
        
        # UPDATE
        Write-Host "\n[3/3] Actualizando Container App..." -ForegroundColor Yellow
        $appName = $services[$service].AppName
        $revision = az containerapp update `
            --name $appName `
            --resource-group $RESOURCE_GROUP `
            --image $imageName `
            --query "properties.latestRevisionName" `
            --output tsv
        
        if ($LASTEXITCODE -ne 0) {
            throw "Error al actualizar Container App de $service"
        }
        
        Write-Host "Container App actualizado: $revision" -ForegroundColor Green
        $successCount++
        
        Write-Host "`nEsperando 10 segundos antes del siguiente servicio..." -ForegroundColor DarkGray
        Start-Sleep -Seconds 10
        
    } catch {
        Write-Host "`nERROR en $service : $_" -ForegroundColor Red
        $failedServices += $service
    }
    
    Write-Host ""
}

# Resumen final
Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "  RESUMEN DE ACTUALIZACION" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

Write-Host "Exitosos: $successCount / $($services.Count)" -ForegroundColor Green

if ($failedServices.Count -gt 0) {
    Write-Host "Fallidos: $($failedServices.Count)" -ForegroundColor Red
    foreach ($failed in $failedServices) {
        Write-Host "  - $failed" -ForegroundColor Red
    }
} else {
    Write-Host "TODOS los servicios actualizados correctamente!" -ForegroundColor Green
}

Write-Host "`nCAMBIOS PRINCIPALES APLICADOS:" -ForegroundColor White
Write-Host "  Gateway:" -ForegroundColor Cyan
Write-Host "    - Modulo Privilegios agregado" -ForegroundColor Gray
Write-Host "    - DTOs con estados en espanol" -ForegroundColor Gray
Write-Host "  Companias:" -ForegroundColor Cyan
Write-Host "    - Schema sin id_solicitud" -ForegroundColor Gray
Write-Host "    - Validaciones HTTP cross-DB" -ForegroundColor Gray
Write-Host "  Evaluaciones:" -ForegroundColor Cyan
Write-Host "    - Validaciones HTTP agregadas" -ForegroundColor Gray
Write-Host "  Core y Auth:" -ForegroundColor Cyan
Write-Host "    - PrismaModule optimizado" -ForegroundColor Gray

Write-Host "`nURLs DE SERVICIOS:" -ForegroundColor Cyan
Write-Host "  Swagger: https://ppp-gateway.mangostone-7d7c463e.eastus.azurecontainerapps.io/api/docs" -ForegroundColor White
Write-Host "  Health:  https://ppp-gateway.mangostone-7d7c463e.eastus.azurecontainerapps.io/health" -ForegroundColor White
Write-Host ""
