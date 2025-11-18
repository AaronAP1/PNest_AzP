# ============================================
# SCRIPT DE ACTUALIZACION DE DESPLIEGUE EN AZURE
# Azure Container Apps - 5 Microservicios PPP
# ============================================

# Colores para output
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Error { Write-Host $args -ForegroundColor Red }

Write-Info "============================================"
Write-Info "ACTUALIZACION: 5 MICROSERVICIOS PPP EN AZURE"
Write-Info "============================================"
Write-Info ""

# ============================================
# PASO 1: CONFIGURACION
# ============================================

Write-Info "PASO 1: Configuracion de recursos existentes"
Write-Info ""

# Usar recursos existentes
$RESOURCE_GROUP = "rg-ppp-microservices"
$LOCATION = "brazilsouth"
$ENVIRONMENT = "ppp-env"
$ACR_NAME = "acrpppnest3008"  # ACR existente

Write-Info "Resource Group: $RESOURCE_GROUP"
Write-Info "Location: $LOCATION"
Write-Info "Environment: $ENVIRONMENT"
Write-Info "ACR Name: $ACR_NAME"
Write-Info ""

# Confirmar antes de continuar
$confirm = Read-Host "Continuar con la actualizacion del despliegue? (s/n)"
if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Warning "Actualizacion cancelada por el usuario"
    exit
}

# ============================================
# PASO 2: VERIFICAR PREREQUISITOS
# ============================================

Write-Info ""
Write-Info "PASO 2: Verificando prerequisitos"
Write-Info ""

# Verificar Azure CLI
try {
    az --version | Out-Null
    Write-Success "✓ Azure CLI instalado"
} catch {
    Write-Error "Azure CLI no encontrado"
    exit 1
}

# Verificar Docker
try {
    docker --version | Out-Null
    Write-Success "✓ Docker instalado"
} catch {
    Write-Error "Docker no encontrado"
    exit 1
}

# Verificar login en Azure
Write-Info "Verificando sesion de Azure..."
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Warning "No estas logueado en Azure. Iniciando login..."
    az login
    $account = az account show | ConvertFrom-Json
}
Write-Success "✓ Logueado como: $($account.user.name)"
Write-Info ""

# Verificar que existen los recursos
Write-Info "Verificando recursos existentes..."
$rgExists = az group exists --name $RESOURCE_GROUP
if ($rgExists -eq "false") {
    Write-Error "Resource Group $RESOURCE_GROUP no existe. Ejecuta deploy-azure.ps1 primero"
    exit 1
}
Write-Success "✓ Resource Group encontrado"

$envExists = az containerapp env show --name $ENVIRONMENT --resource-group $RESOURCE_GROUP 2>$null
if (-not $envExists) {
    Write-Error "Environment $ENVIRONMENT no existe"
    exit 1
}
Write-Success "✓ Container Apps Environment encontrado"

# Obtener credenciales del ACR
Write-Info "Obteniendo credenciales del ACR..."
$acrCreds = az acr credential show --name $ACR_NAME 2>$null | ConvertFrom-Json
if (-not $acrCreds) {
    Write-Error "No se pudieron obtener credenciales del ACR $ACR_NAME"
    exit 1
}
$ACR_USERNAME = $acrCreds.username
$ACR_PASSWORD = $acrCreds.passwords[0].value
Write-Success "✓ Credenciales ACR obtenidas"
Write-Info ""

# ============================================
# PASO 3: BUILD Y PUSH DE IMAGENES DOCKER
# ============================================

Write-Info "PASO 3: Construyendo y subiendo imagenes Docker de los 5 servicios"
Write-Info ""

# Login al ACR
Write-Info "Login al Azure Container Registry..."
az acr login --name $ACR_NAME
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al hacer login en ACR"
    exit 1
}
Write-Success "✓ Login exitoso al ACR"
Write-Info ""

# Build y push ppp-auth-service
Write-Info "[1/5] Building ppp-auth-service..."
docker build -t "$ACR_NAME.azurecr.io/ppp-auth:latest" -f apps/ppp-auth-service/Dockerfile .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al construir imagen ppp-auth-service"
    exit 1
}
Write-Success "✓ Imagen ppp-auth construida"

Write-Info "Subiendo ppp-auth a ACR..."
docker push "$ACR_NAME.azurecr.io/ppp-auth:latest"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al subir imagen ppp-auth"
    exit 1
}
Write-Success "✓ ppp-auth subido al ACR"
Write-Info ""

# Build y push ppp-core
Write-Info "[2/5] Building ppp-core..."
docker build -t "$ACR_NAME.azurecr.io/ppp-core:latest" -f apps/ppp_core/Dockerfile .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al construir imagen ppp-core"
    exit 1
}
Write-Success "✓ Imagen ppp-core construida"

Write-Info "Subiendo ppp-core a ACR..."
docker push "$ACR_NAME.azurecr.io/ppp-core:latest"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al subir imagen ppp-core"
    exit 1
}
Write-Success "✓ ppp-core subido al ACR"
Write-Info ""

# Build y push ppp-companias
Write-Info "[3/5] Building ppp-companias..."
docker build -t "$ACR_NAME.azurecr.io/ppp-companias:latest" -f Dockerfile.companias .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al construir imagen ppp-companias"
    exit 1
}
Write-Success "✓ Imagen ppp-companias construida"

Write-Info "Subiendo ppp-companias a ACR..."
docker push "$ACR_NAME.azurecr.io/ppp-companias:latest"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al subir imagen ppp-companias"
    exit 1
}
Write-Success "✓ ppp-companias subido al ACR"
Write-Info ""

# Build y push ppp-evaluaciones-service
Write-Info "[4/5] Building ppp-evaluaciones-service..."
docker build -t "$ACR_NAME.azurecr.io/ppp-evaluaciones:latest" -f apps/ppp-evaluaciones-service/Dockerfile .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al construir imagen ppp-evaluaciones-service"
    exit 1
}
Write-Success "✓ Imagen ppp-evaluaciones construida"

Write-Info "Subiendo ppp-evaluaciones a ACR..."
docker push "$ACR_NAME.azurecr.io/ppp-evaluaciones:latest"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al subir imagen ppp-evaluaciones"
    exit 1
}
Write-Success "✓ ppp-evaluaciones subido al ACR"
Write-Info ""

# Build y push API Gateway
Write-Info "[5/5] Building ppaz-api-gateway..."
docker build -t "$ACR_NAME.azurecr.io/ppaz-gateway:latest" -f apps/ppaz-api-gateway/Dockerfile .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al construir imagen ppaz-gateway"
    exit 1
}
Write-Success "✓ Imagen ppaz-gateway construida"

Write-Info "Subiendo ppaz-gateway a ACR..."
docker push "$ACR_NAME.azurecr.io/ppaz-gateway:latest"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al subir imagen ppaz-gateway"
    exit 1
}
Write-Success "✓ ppaz-gateway subido al ACR"
Write-Info ""

# ============================================
# PASO 4: DESPLEGAR/ACTUALIZAR CONTAINER APPS
# ============================================

Write-Info "PASO 4: Desplegando y actualizando Container Apps"
Write-Info ""

# Leer configuraciones desde archivos JSON
Write-Info "Leyendo configuraciones desde archivos JSON..."
$envAuth = Get-Content "env-auth.json" | ConvertFrom-Json
$envCore = Get-Content "env-core.json" | ConvertFrom-Json
$envCompanias = Get-Content "env-companias.json" | ConvertFrom-Json
$envEvaluaciones = Get-Content "env-evaluaciones.json" | ConvertFrom-Json
$envGateway = Get-Content "env-gateway.json" | ConvertFrom-Json

# Convertir arrays JSON a formato --env-vars
function ConvertTo-EnvVarsString {
    param($envArray)
    $envVars = @()
    foreach ($item in $envArray) {
        $envVars += "$($item.name)=`"$($item.value)`""
    }
    return $envVars -join " "
}

$authEnvVars = ConvertTo-EnvVarsString $envAuth
$coreEnvVars = ConvertTo-EnvVarsString $envCore
$companiasEnvVars = ConvertTo-EnvVarsString $envCompanias
$evaluacionesEnvVars = ConvertTo-EnvVarsString $envEvaluaciones
$gatewayEnvVars = ConvertTo-EnvVarsString $envGateway

Write-Success "✓ Configuraciones leidas"
Write-Info ""

# 1. Desplegar ppp-auth-service (NUEVO)
Write-Info "[1/5] Desplegando ppp-auth-service (NUEVO)..."
$authExists = az containerapp show --name ppp-auth-service --resource-group $RESOURCE_GROUP 2>$null
if ($authExists) {
    Write-Info "   Servicio existe, actualizando..."
    az containerapp update `
        --name ppp-auth-service `
        --resource-group $RESOURCE_GROUP `
        --image "$ACR_NAME.azurecr.io/ppp-auth:latest" `
        --set-env-vars $authEnvVars.Split(" ")
} else {
    Write-Info "   Creando nuevo servicio..."
    az containerapp create `
        --name ppp-auth-service `
        --resource-group $RESOURCE_GROUP `
        --environment $ENVIRONMENT `
        --image "$ACR_NAME.azurecr.io/ppp-auth:latest" `
        --target-port 3001 `
        --ingress internal `
        --registry-server "$ACR_NAME.azurecr.io" `
        --registry-username $ACR_USERNAME `
        --registry-password "$ACR_PASSWORD" `
        --env-vars $authEnvVars.Split(" ") `
        --cpu 0.5 `
        --memory 1Gi `
        --min-replicas 1 `
        --max-replicas 3
}

if ($LASTEXITCODE -eq 0) {
    Write-Success "✓ ppp-auth-service desplegado"
} else {
    Write-Error "Error al desplegar ppp-auth-service"
    exit 1
}
Write-Info ""

# 2. Actualizar ppp-core-service
Write-Info "[2/5] Actualizando ppp-core-service..."
az containerapp update `
    --name ppp-core-service `
    --resource-group $RESOURCE_GROUP `
    --image "$ACR_NAME.azurecr.io/ppp-core:latest" `
    --set-env-vars $coreEnvVars.Split(" ")

if ($LASTEXITCODE -eq 0) {
    Write-Success "✓ ppp-core-service actualizado"
} else {
    Write-Error "Error al actualizar ppp-core-service"
    exit 1
}
Write-Info ""

# 3. Actualizar ppp-companias-service
Write-Info "[3/5] Actualizando ppp-companias-service..."
az containerapp update `
    --name ppp-companias-service `
    --resource-group $RESOURCE_GROUP `
    --image "$ACR_NAME.azurecr.io/ppp-companias:latest" `
    --set-env-vars $companiasEnvVars.Split(" ")

if ($LASTEXITCODE -eq 0) {
    Write-Success "✓ ppp-companias-service actualizado"
} else {
    Write-Error "Error al actualizar ppp-companias-service"
    exit 1
}
Write-Info ""

# 4. Desplegar ppp-evaluaciones-service (NUEVO)
Write-Info "[4/5] Desplegando ppp-evaluaciones-service (NUEVO)..."
$evalExists = az containerapp show --name ppp-evaluaciones-service --resource-group $RESOURCE_GROUP 2>$null
if ($evalExists) {
    Write-Info "   Servicio existe, actualizando..."
    az containerapp update `
        --name ppp-evaluaciones-service `
        --resource-group $RESOURCE_GROUP `
        --image "$ACR_NAME.azurecr.io/ppp-evaluaciones:latest" `
        --set-env-vars $evaluacionesEnvVars.Split(" ")
} else {
    Write-Info "   Creando nuevo servicio..."
    az containerapp create `
        --name ppp-evaluaciones-service `
        --resource-group $RESOURCE_GROUP `
        --environment $ENVIRONMENT `
        --image "$ACR_NAME.azurecr.io/ppp-evaluaciones:latest" `
        --target-port 3004 `
        --ingress internal `
        --registry-server "$ACR_NAME.azurecr.io" `
        --registry-username $ACR_USERNAME `
        --registry-password "$ACR_PASSWORD" `
        --env-vars $evaluacionesEnvVars.Split(" ") `
        --cpu 0.5 `
        --memory 1Gi `
        --min-replicas 1 `
        --max-replicas 3
}

if ($LASTEXITCODE -eq 0) {
    Write-Success "✓ ppp-evaluaciones-service desplegado"
} else {
    Write-Error "Error al desplegar ppp-evaluaciones-service"
    exit 1
}
Write-Info ""

# 5. Actualizar ppaz-api-gateway (con referencias a los nuevos servicios)
Write-Info "[5/5] Actualizando ppaz-api-gateway..."
az containerapp update `
    --name ppaz-api-gateway `
    --resource-group $RESOURCE_GROUP `
    --image "$ACR_NAME.azurecr.io/ppaz-gateway:latest" `
    --set-env-vars $gatewayEnvVars.Split(" ")

if ($LASTEXITCODE -eq 0) {
    Write-Success "✓ ppaz-api-gateway actualizado"
} else {
    Write-Error "Error al actualizar ppaz-api-gateway"
    exit 1
}
Write-Info ""

# ============================================
# PASO 5: VERIFICAR DESPLIEGUE
# ============================================

Write-Info "PASO 5: Verificando despliegue"
Write-Info ""

# Obtener FQDNs
Write-Info "Obteniendo FQDNs de los servicios..."
$AUTH_FQDN = (az containerapp show --name ppp-auth-service --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv 2>$null)
$CORE_FQDN = (az containerapp show --name ppp-core-service --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)
$COMPANIAS_FQDN = (az containerapp show --name ppp-companias-service --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)
$EVAL_FQDN = (az containerapp show --name ppp-evaluaciones-service --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv 2>$null)
$GATEWAY_URL = (az containerapp show --name ppaz-api-gateway --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)

Write-Info ""
Write-Success "============================================"
Write-Success "ACTUALIZACION COMPLETADA EXITOSAMENTE!"
Write-Success "============================================"
Write-Info ""
Write-Success "URL PUBLICA:"
Write-Success "   🌐 API Gateway: https://$GATEWAY_URL"
Write-Success "   📖 Swagger UI:  https://$GATEWAY_URL/api/docs"
Write-Success "   ❤️  Health Check: https://$GATEWAY_URL/health"
Write-Info ""
Write-Info "MICROSERVICIOS INTERNOS (5 servicios):"
Write-Info "   1. 🔐 ppp-auth:        https://$AUTH_FQDN"
Write-Info "   2. 📚 ppp-core:        https://$CORE_FQDN"
Write-Info "   3. 🏢 ppp-companias:   https://$COMPANIAS_FQDN"
Write-Info "   4. 📝 ppp-evaluaciones: https://$EVAL_FQDN"
Write-Info "   5. 🚪 ppaz-gateway:    https://$GATEWAY_URL"
Write-Info ""
Write-Info "RECURSOS AZURE:"
Write-Info "   - Resource Group: $RESOURCE_GROUP"
Write-Info "   - Location: $LOCATION"
Write-Info "   - Container Registry: $ACR_NAME.azurecr.io"
Write-Info "   - Environment: $ENVIRONMENT"
Write-Info ""

# Guardar informacion actualizada
$deploymentInfo = "ACTUALIZACION DE DESPLIEGUE - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n"
$deploymentInfo += "========================================================================`n`n"
$deploymentInfo += "ARQUITECTURA: 5 MICROSERVICIOS`n`n"
$deploymentInfo += "URL PUBLICA:`n"
$deploymentInfo += "- API Gateway: https://$GATEWAY_URL`n"
$deploymentInfo += "- Swagger UI:  https://$GATEWAY_URL/api/docs`n"
$deploymentInfo += "- Health Check: https://$GATEWAY_URL/health`n`n"
$deploymentInfo += "MICROSERVICIOS INTERNOS (HTTPS puerto 443):`n"
$deploymentInfo += "1. ppp-auth-service:        https://$AUTH_FQDN`n"
$deploymentInfo += "2. ppp-core-service:        https://$CORE_FQDN`n"
$deploymentInfo += "3. ppp-companias-service:   https://$COMPANIAS_FQDN`n"
$deploymentInfo += "4. ppp-evaluaciones-service: https://$EVAL_FQDN`n"
$deploymentInfo += "5. ppaz-api-gateway:        https://$GATEWAY_URL (publico)`n`n"
$deploymentInfo += "PUERTOS LOCALES (desarrollo):`n"
$deploymentInfo += "- Gateway: 3000`n"
$deploymentInfo += "- Auth: 3001`n"
$deploymentInfo += "- Core: 3002`n"
$deploymentInfo += "- Compañias: 3003`n"
$deploymentInfo += "- Evaluaciones: 3004`n`n"
$deploymentInfo += "RECURSOS AZURE:`n"
$deploymentInfo += "- Resource Group: $RESOURCE_GROUP`n"
$deploymentInfo += "- Location: $LOCATION (Brazil South)`n"
$deploymentInfo += "- Container Registry: $ACR_NAME.azurecr.io`n"
$deploymentInfo += "- Environment: $ENVIRONMENT`n`n"
$deploymentInfo += "BASES DE DATOS:`n"
$deploymentInfo += "- pppNest_Core (auth core evaluaciones)`n"
$deploymentInfo += "- pppNest_Companias (companias)`n"

$deploymentInfo | Out-File -FilePath "deployment-info-updated.txt" -Encoding UTF8
Write-Success "✓ Informacion guardada en: deployment-info-updated.txt"
Write-Info ""

# Test rapido de health check
Write-Info "Realizando test de health check..."
Start-Sleep -Seconds 5
try {
    $response = Invoke-WebRequest -Uri "https://$GATEWAY_URL/health/live" -UseBasicParsing -TimeoutSec 15
    if ($response.StatusCode -eq 200) {
        Write-Success "✓ API Gateway responde correctamente!"
        Write-Info "   Respuesta: $($response.Content)"
    }
} catch {
    Write-Warning "⚠️  Health check no disponible aun (puede tardar 1-2 minutos en iniciar)"
    Write-Info "   Intenta manualmente: https://$GATEWAY_URL/health/live"
}

Write-Info ""
Write-Success "🎉 Actualizacion completada! Prueba tu API en: https://$GATEWAY_URL/api/docs"
Write-Info ""
Write-Info "📋 Endpoints corregidos para probar:"
Write-Info "   - GET /alumnos"
Write-Info "   - GET /facultades"
Write-Info "   - GET /escuelas"
Write-Info "   - GET /secretarias"
Write-Info "   - GET /supervisores"
Write-Info "   - GET /coordinadores"
Write-Info "   - GET /lineas-facultad"
Write-Info ""
