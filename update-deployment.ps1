# ============================================
# SCRIPT DE ACTUALIZACIÓN DE DESPLIEGUE
# Actualiza las imágenes Docker en Azure
# ============================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("all", "core", "companias", "gateway")]
    [string]$Service = "all"
)

# Colores para output
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Error { Write-Host $args -ForegroundColor Red }

Write-Info "============================================"
Write-Info "🔄 ACTUALIZACIÓN DE DESPLIEGUE"
Write-Info "============================================"
Write-Info ""

# Leer información del despliegue anterior
if (Test-Path "deployment-info.txt") {
    $content = Get-Content "deployment-info.txt" -Raw
    
    if ($content -match 'Resource Group: (.+)') {
        $RESOURCE_GROUP = $matches[1].Trim()
    } else {
        $RESOURCE_GROUP = $null
    }
    
    if ($content -match 'Container Registry: (.+).azurecr.io') {
        $ACR_NAME = $matches[1].Trim()
    } else {
        $ACR_NAME = $null
    }
    
    if ($RESOURCE_GROUP -and $ACR_NAME) {
        Write-Success "✅ Configuración encontrada:"
        Write-Info "   Resource Group: $RESOURCE_GROUP"
        Write-Info "   ACR: $ACR_NAME"
        Write-Info ""
    } else {
        Write-Error "❌ No se pudo leer la configuración del deployment-info.txt"
        Write-Info "Por favor, proporciona manualmente:"
        $RESOURCE_GROUP = Read-Host "Resource Group"
        $ACR_NAME = Read-Host "ACR Name"
    }
} else {
    Write-Warning "⚠️  No se encontró deployment-info.txt"
    Write-Info "Por favor, proporciona manualmente:"
    $RESOURCE_GROUP = Read-Host "Resource Group"
    $ACR_NAME = Read-Host "ACR Name"
}

# Login al ACR
Write-Info "Login al Azure Container Registry..."
az acr login --name $ACR_NAME
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Error al hacer login en ACR"
    exit 1
}

# Función para actualizar un servicio
function Update-Service {
    param(
        [string]$ServiceName,
        [string]$ImageName,
        [string]$Dockerfile,
        [string]$ContainerAppName
    )
    
    Write-Info ""
    Write-Info "🔨 Actualizando $ServiceName..."
    Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Build
    Write-Info "   Building imagen..."
    docker build -t "$ACR_NAME.azurecr.io/$ImageName:latest" -f $Dockerfile .
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Error al construir imagen $ServiceName"
        return $false
    }
    Write-Success "   ✅ Imagen construida"
    
    # Push
    Write-Info "   Subiendo a ACR..."
    docker push "$ACR_NAME.azurecr.io/$ImageName:latest"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Error al subir imagen $ServiceName"
        return $false
    }
    Write-Success "   ✅ Imagen subida"
    
    # Update Container App
    Write-Info "   Actualizando Container App..."
    az containerapp update `
        --name $ContainerAppName `
        --resource-group $RESOURCE_GROUP `
        --image "$ACR_NAME.azurecr.io/$ImageName:latest" `
        --output none
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "   ✅ $ServiceName actualizado"
        return $true
    } else {
        Write-Error "   ❌ Error al actualizar Container App"
        return $false
    }
}

# Actualizar servicios según parámetro
$success = $true

switch ($Service) {
    "core" {
        $success = Update-Service -ServiceName "ppp_core" `
                                  -ImageName "ppp-core" `
                                  -Dockerfile "apps/ppp_core/Dockerfile" `
                                  -ContainerAppName "ppp-core-service"
    }
    "companias" {
        $success = Update-Service -ServiceName "ppp_compañías" `
                                  -ImageName "ppp-companias" `
                                  -Dockerfile "apps/ppp_compañias/Dockerfile" `
                                  -ContainerAppName "ppp-companias-service"
    }
    "gateway" {
        $success = Update-Service -ServiceName "API Gateway" `
                                  -ImageName "ppaz-gateway" `
                                  -Dockerfile "apps/ppaz-api-gateway/Dockerfile" `
                                  -ContainerAppName "ppaz-api-gateway"
    }
    "all" {
        Write-Info "Actualizando todos los servicios..."
        Write-Info ""
        
        $s1 = Update-Service -ServiceName "ppp_core" `
                            -ImageName "ppp-core" `
                            -Dockerfile "apps/ppp_core/Dockerfile" `
                            -ContainerAppName "ppp-core-service"
        
        $s2 = Update-Service -ServiceName "ppp_compañías" `
                            -ImageName "ppp-companias" `
                            -Dockerfile "apps/ppp_compañias/Dockerfile" `
                            -ContainerAppName "ppp-companias-service"
        
        $s3 = Update-Service -ServiceName "API Gateway" `
                            -ImageName "ppaz-gateway" `
                            -Dockerfile "apps/ppaz-api-gateway/Dockerfile" `
                            -ContainerAppName "ppaz-api-gateway"
        
        $success = $s1 -and $s2 -and $s3
    }
}

Write-Info ""
if ($success) {
    Write-Success "============================================"
    Write-Success "✅ ¡ACTUALIZACIÓN COMPLETADA!"
    Write-Success "============================================"
    Write-Info ""
    Write-Info "Los cambios estarán disponibles en unos segundos."
    Write-Info "Puedes verificar el estado con:"
    Write-Info "   az containerapp revision list --name ppaz-api-gateway --resource-group $RESOURCE_GROUP -o table"
} else {
    Write-Error "============================================"
    Write-Error "❌ ACTUALIZACIÓN FALLÓ"
    Write-Error "============================================"
    Write-Info ""
    Write-Info "Revisa los errores anteriores y vuelve a intentar."
}

Write-Info ""
