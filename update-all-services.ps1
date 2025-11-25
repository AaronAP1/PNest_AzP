# ============================================================
# SCRIPT: Actualizar TODOS los microservicios en Azure
# ============================================================
# Actualiza Gateway, Auth, Core, Companias y Evaluaciones
# con todas las correcciones aplicadas
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "  ACTUALIZACION COMPLETA DE MICROSERVICIOS" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# Variables
$ACR_NAME = "acrpppnest3008"
$RESOURCE_GROUP = "rg-ppp-microservices"

# Servicios a actualizar (nombre del servicio -> Dockerfile path)
$services = @{
    "ppaz-api-gateway" = "apps/ppaz-api-gateway/Dockerfile"
    "ppp-auth-service" = "apps/ppp-auth-service/Dockerfile"
    "ppp-core" = "apps/ppp_core/Dockerfile"
    "ppp-companias" = "apps/ppp_companias/Dockerfile"
    "ppp-evaluaciones" = "apps/ppp-evaluaciones-service/Dockerfile"
}

Write-Host "📋 Servicios a actualizar:" -ForegroundColor Yellow
foreach ($service in $services.Keys) {
    Write-Host "  • $service" -ForegroundColor Gray
}
Write-Host ""

# Autenticación ACR una sola vez
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
    $dockerfile = $services[$service]
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
        Write-Host "`n[3/3] Actualizando Container App..." -ForegroundColor Yellow
        $revision = az containerapp update `
            --name $service `
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
        Write-Host "  * $failed" -ForegroundColor Red
    }
} else {
    Write-Host "TODOS los servicios actualizados correctamente!" -ForegroundColor Green
}

Write-Host "`nCAMBIOS PRINCIPALES APLICADOS:" -ForegroundColor White
Write-Host "  Gateway:" -ForegroundColor Cyan
Write-Host "    * Modulo Privilegios agregado (CRUD + Swagger)" -ForegroundColor Gray
Write-Host "    * DTOs de CartaPresentacion con estados en espanol" -ForegroundColor Gray
Write-Host "    * Endpoints de gestion privilegios en Roles" -ForegroundColor Gray
Write-Host ""
Write-Host "  Companias:" -ForegroundColor Cyan
Write-Host "    * Schema sin id_solicitud en CartaPresentacion" -ForegroundColor Gray
Write-Host "    * Validaciones HTTP para referencias cross-DB" -ForegroundColor Gray
Write-Host "    * Includes actualizados (sin relaciones invalidas)" -ForegroundColor Gray
Write-Host ""
Write-Host "  Evaluaciones:" -ForegroundColor Cyan
Write-Host "    * Validaciones HTTP para idSupervisor, idAlumno, idSolicitud" -ForegroundColor Gray
Write-Host ""
Write-Host "  Core:" -ForegroundColor Cyan
Write-Host "    * PrismaModule optimizado 1 pool en lugar de 3" -ForegroundColor Gray
Write-Host ""
Write-Host "  Auth:" -ForegroundColor Cyan
Write-Host "    * PrismaModule optimizado" -ForegroundColor Gray

Write-Host "`nURLs DE SERVICIOS:" -ForegroundColor Cyan
Write-Host "  Gateway: https://ppp-gateway.mangostone-7d7c463e.eastus.azurecontainerapps.io" -ForegroundColor White
Write-Host "  Swagger: https://ppp-gateway.mangostone-7d7c463e.eastus.azurecontainerapps.io/api/docs" -ForegroundColor White
Write-Host "  Health:  https://ppp-gateway.mangostone-7d7c463e.eastus.azurecontainerapps.io/health" -ForegroundColor White

Write-Host "`nPROXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "  1. Verificar health checks en: /health" -ForegroundColor Gray
Write-Host "  2. Revisar Swagger en: /api/docs" -ForegroundColor Gray
Write-Host "  3. Probar endpoints de Privilegios" -ForegroundColor Gray
Write-Host "  4. Verificar validaciones cross-DB funcionando" -ForegroundColor Gray
Write-Host ""
