# ============================================
# SCRIPT DE DESPLIEGUE COMPLETO EN AZURE
# Azure Container Apps - Microservicios PPP
# ============================================

# Colores para output
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Error { Write-Host $args -ForegroundColor Red }

Write-Info "============================================"
Write-Info "DESPLIEGUE DE MICROSERVICIOS PPP EN AZURE"
Write-Info "============================================"
Write-Info ""

# ============================================
# PASO 1: CONFIGURACION
# ============================================

Write-Info "PASO 1: Configuracion de variables"
Write-Info ""

# IMPORTANTE: Cambia estos valores segun tu configuracion
$RESOURCE_GROUP = "rg-ppp-microservices"
$LOCATION = "brazilsouth"  # Usando Brazil South (region mas cercana permitida en Azure for Students)
$ENVIRONMENT = "ppp-env"
$ACR_NAME = "acrpppnest$(Get-Random -Minimum 1000 -Maximum 9999)"

# Leer connection strings de los archivos .env existentes
Write-Info "Leyendo configuracion de archivos .env..."

$DB_CORE = $null
$DB_COMPANIAS = $null

# Leer DATABASE_URL_CORE del .env de ppp_core
if (Test-Path "apps/ppp_core/.env") {
    $coreEnv = Get-Content "apps/ppp_core/.env" | Where-Object { $_ -match '^DATABASE_URL_CORE=' }
    if ($coreEnv) {
        $DB_CORE = $coreEnv -replace '^DATABASE_URL_CORE=', '' -replace '"', ''
        Write-Success "DATABASE_URL_CORE leida desde apps/ppp_core/.env"
    }
}

# Leer DATABASE_URL_COMPANIAS del .env de ppp_companias
$companiasPath = "apps/ppp_compañias/.env"
if (-not (Test-Path $companiasPath)) {
    # Intentar con otro encoding si no se encuentra
    $companiasPath = Get-ChildItem -Path "apps" -Filter "ppp_comp*" -Directory | Select-Object -First 1 | ForEach-Object { "$($_.FullName)/.env" }
}

if ($companiasPath -and (Test-Path $companiasPath)) {
    $companiasEnv = Get-Content $companiasPath | Where-Object { $_ -match '^DATABASE_URL_COMPANIAS=' }
    if ($companiasEnv) {
        $DB_COMPANIAS = $companiasEnv -replace '^DATABASE_URL_COMPANIAS=', '' -replace '"', ''
        Write-Success "DATABASE_URL_COMPANIAS leida desde $companiasPath"
    }
}

# Validar que se obtuvieron las connection strings
if (-not $DB_CORE -or -not $DB_COMPANIAS) {
    Write-Error "No se pudieron leer las connection strings de los archivos .env"
    Write-Info "Asegurate de que existen:"
    Write-Info "   - apps/ppp_core/.env con DATABASE_URL_CORE"
    Write-Info "   - apps/ppp_compañias/.env con DATABASE_URL_COMPANIAS"
    exit 1
}

Write-Info ""
Write-Info "Resource Group: $RESOURCE_GROUP"
Write-Info "Location: $LOCATION"
Write-Info "Environment: $ENVIRONMENT"
Write-Info "ACR Name: $ACR_NAME"
Write-Info ""

# Confirmar antes de continuar
$confirm = Read-Host "Continuar con el despliegue? (s/n)"
if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Warning "Despliegue cancelado por el usuario"
    exit
}

# ============================================
# PASO 2: VERIFICAR PREREQUISITOS
# ============================================

Write-Info "PASO 2: Verificando prerequisitos"
Write-Info ""

# Verificar Azure CLI
try {
    az --version | Out-Null
    Write-Success "Azure CLI instalado"
} catch {
    Write-Error "Azure CLI no encontrado. Instalalo desde: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
}

# Verificar Docker
try {
    docker --version | Out-Null
    Write-Success "Docker instalado"
} catch {
    Write-Error "Docker no encontrado. Instalalo desde: https://www.docker.com/products/docker-desktop"
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
Write-Success "Logueado en Azure como: $($account.user.name)"
Write-Info "   Subscription: $($account.name)"
Write-Info ""

# ============================================
# PASO 3: CREAR RECURSOS EN AZURE
# ============================================

Write-Info "PASO 3: Creando recursos en Azure"
Write-Info ""

# Crear Resource Group
Write-Info "Creando Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION --output none
if ($LASTEXITCODE -eq 0) {
    Write-Success "Resource Group creado: $RESOURCE_GROUP"
} else {
    Write-Error "Error al crear Resource Group"
    exit 1
}

# Crear Azure Container Registry
Write-Info "Creando Azure Container Registry..."
az acr create `
    --resource-group $RESOURCE_GROUP `
    --name $ACR_NAME `
    --sku Basic `
    --admin-enabled true `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Success "Azure Container Registry creado: $ACR_NAME"
} else {
    Write-Error "Error al crear ACR"
    exit 1
}

# Esperar a que el ACR este realmente disponible
Write-Info "Esperando a que el ACR este disponible..."
Start-Sleep -Seconds 30

# Obtener credenciales del ACR con reintentos
Write-Info "Obteniendo credenciales del ACR..."
$maxRetries = 5
$retryCount = 0
$acrCreds = $null

while ($retryCount -lt $maxRetries) {
    try {
        $acrCreds = az acr credential show --name $ACR_NAME 2>$null | ConvertFrom-Json
        if ($acrCreds -and $acrCreds.passwords) {
            break
        }
    } catch {
        # Ignorar error y reintentar
    }
    $retryCount++
    if ($retryCount -lt $maxRetries) {
        Write-Info "   Reintentando... ($retryCount/$maxRetries)"
        Start-Sleep -Seconds 10
    }
}

if (-not $acrCreds -or -not $acrCreds.passwords) {
    Write-Error "No se pudieron obtener credenciales del ACR despues de $maxRetries intentos"
    exit 1
}

$ACR_USERNAME = $acrCreds.username
$ACR_PASSWORD = $acrCreds.passwords[0].value
Write-Success "Credenciales obtenidas"

# Registrar proveedores necesarios
Write-Info "Verificando proveedores de Azure..."
$providers = @("Microsoft.OperationalInsights", "Microsoft.App")
foreach ($provider in $providers) {
    $state = az provider show --namespace $provider --query "registrationState" -o tsv 2>$null
    if ($state -ne "Registered") {
        Write-Info "Registrando proveedor $provider..."
        az provider register --namespace $provider --output none
    }
}

# Esperar a que los proveedores esten registrados
Write-Info "Esperando registro de proveedores (puede tardar 1-2 minutos)..."
foreach ($provider in $providers) {
    $maxWait = 120  # 2 minutos
    $waited = 0
    while ($waited -lt $maxWait) {
        $state = az provider show --namespace $provider --query "registrationState" -o tsv
        if ($state -eq "Registered") {
            Write-Success "Proveedor $provider registrado"
            break
        }
        Start-Sleep -Seconds 10
        $waited += 10
        Write-Info "   Esperando... ($waited segundos)"
    }
}

# Crear Log Analytics Workspace primero
Write-Info "Creando Log Analytics Workspace..."
$WORKSPACE_NAME = "workspace-ppp-$(Get-Random -Minimum 1000 -Maximum 9999)"
az monitor log-analytics workspace create `
    --resource-group $RESOURCE_GROUP `
    --workspace-name $WORKSPACE_NAME `
    --location $LOCATION `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Success "Log Analytics Workspace creado: $WORKSPACE_NAME"
    
    # Obtener el ID del workspace
    Start-Sleep -Seconds 10
    $WORKSPACE_ID = az monitor log-analytics workspace show `
        --resource-group $RESOURCE_GROUP `
        --workspace-name $WORKSPACE_NAME `
        --query customerId -o tsv
    
    $WORKSPACE_KEY = az monitor log-analytics workspace get-shared-keys `
        --resource-group $RESOURCE_GROUP `
        --workspace-name $WORKSPACE_NAME `
        --query primarySharedKey -o tsv
} else {
    Write-Warning "No se pudo crear Log Analytics Workspace, continuando sin el..."
    $WORKSPACE_ID = $null
}

# Crear Container Apps Environment
Write-Info "Creando Container Apps Environment (esto puede tardar 2-3 minutos)..."
if ($WORKSPACE_ID) {
    az containerapp env create `
        --name $ENVIRONMENT `
        --resource-group $RESOURCE_GROUP `
        --location $LOCATION `
        --logs-workspace-id $WORKSPACE_ID `
        --logs-workspace-key $WORKSPACE_KEY `
        --output none
} else {
    az containerapp env create `
        --name $ENVIRONMENT `
        --resource-group $RESOURCE_GROUP `
        --location $LOCATION `
        --output none
}

if ($LASTEXITCODE -eq 0) {
    Write-Success "Container Apps Environment creado: $ENVIRONMENT"
} else {
    Write-Error "Error al crear Environment"
    exit 1
}

Write-Info ""

# ============================================
# PASO 4: BUILD Y PUSH DE IMAGENES DOCKER
# ============================================

Write-Info "PASO 4: Construyendo y subiendo imagenes Docker"
Write-Info ""

# Login al ACR
Write-Info "Login al Azure Container Registry..."
az acr login --name $ACR_NAME
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al hacer login en ACR"
    exit 1
}
Write-Success "Login exitoso al ACR"

# Build y push ppp_core
Write-Info "Building ppp_core..."
docker build -t "$ACR_NAME.azurecr.io/ppp-core:latest" -f apps/ppp_core/Dockerfile .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al construir imagen ppp_core"
    exit 1
}
Write-Success "Imagen ppp_core construida"

Write-Info "Subiendo ppp_core a ACR..."
docker push "$ACR_NAME.azurecr.io/ppp-core:latest"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al subir imagen ppp_core"
    exit 1
}
Write-Success "ppp_core subido al ACR"
Write-Info ""

# Build y push ppp_companias
Write-Info "Building ppp_companias..."
docker build -t "$ACR_NAME.azurecr.io/ppp-companias:latest" -f Dockerfile.companias .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al construir imagen ppp_companias"
    exit 1
}
Write-Success "Imagen ppp_companias construida"

Write-Info "Subiendo ppp_companias a ACR..."
docker push "$ACR_NAME.azurecr.io/ppp-companias:latest"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al subir imagen ppp_companias"
    exit 1
}
Write-Success "ppp_companias subido al ACR"
Write-Info ""

# Build y push API Gateway
Write-Info "Building API Gateway..."
docker build -t "$ACR_NAME.azurecr.io/ppaz-gateway:latest" -f apps/ppaz-api-gateway/Dockerfile .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al construir imagen API Gateway"
    exit 1
}
Write-Success "Imagen API Gateway construida"

Write-Info "Subiendo API Gateway a ACR..."
docker push "$ACR_NAME.azurecr.io/ppaz-gateway:latest"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al subir imagen API Gateway"
    exit 1
}
Write-Success "API Gateway subido al ACR"
Write-Info ""

# ============================================
# PASO 5: DESPLEGAR CONTAINER APPS
# ============================================

Write-Info "PASO 5: Desplegando Container Apps"
Write-Info ""

# Desplegar ppp_core
Write-Info "Desplegando ppp_core microservice..."

az containerapp create `
    --name ppp-core-service `
    --resource-group $RESOURCE_GROUP `
    --environment $ENVIRONMENT `
    --image "$ACR_NAME.azurecr.io/ppp-core:latest" `
    --target-port 3001 `
    --ingress internal `
    --registry-server "$ACR_NAME.azurecr.io" `
    --registry-username $ACR_USERNAME `
    --registry-password "$ACR_PASSWORD" `
    --env-vars DATABASE_URL_CORE="$DB_CORE" APP_NAME=ppp_core PORT=3001 HOST=0.0.0.0 NODE_ENV=production LOG_LEVEL=info `
    --cpu 0.5 `
    --memory 1Gi `
    --min-replicas 1 `
    --max-replicas 3

if ($LASTEXITCODE -eq 0) {
    Write-Success "ppp_core desplegado"
} else {
    Write-Error "Error al desplegar ppp_core"
    exit 1
}

# Desplegar ppp_companias
Write-Info "Desplegando ppp_companias microservice..."

az containerapp create `
    --name ppp-companias-service `
    --resource-group $RESOURCE_GROUP `
    --environment $ENVIRONMENT `
    --image "$ACR_NAME.azurecr.io/ppp-companias:latest" `
    --target-port 3002 `
    --ingress internal `
    --registry-server "$ACR_NAME.azurecr.io" `
    --registry-username $ACR_USERNAME `
    --registry-password "$ACR_PASSWORD" `
    --env-vars DATABASE_URL_COMPANIAS="$DB_COMPANIAS" APP_NAME=ppp_companias PORT=3002 HOST=0.0.0.0 NODE_ENV=production LOG_LEVEL=info `
    --cpu 0.5 `
    --memory 1Gi `
    --min-replicas 1 `
    --max-replicas 3

if ($LASTEXITCODE -eq 0) {
    Write-Success "ppp_companias desplegado"
} else {
    Write-Error "Error al desplegar ppp_companias"
    exit 1
}

# Obtener FQDNs de los microservicios
Write-Info "Obteniendo FQDNs internos de los microservicios..."
$CORE_FQDN = (az containerapp show --name ppp-core-service --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)
$COMPANIAS_FQDN = (az containerapp show --name ppp-companias-service --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)

Write-Info "   Core FQDN: $CORE_FQDN"
Write-Info "   Companias FQDN: $COMPANIAS_FQDN"

# Desplegar API Gateway
Write-Info "Desplegando API Gateway (punto de entrada publico)..."
az containerapp create `
    --name ppaz-api-gateway `
    --resource-group $RESOURCE_GROUP `
    --environment $ENVIRONMENT `
    --image "$ACR_NAME.azurecr.io/ppaz-gateway:latest" `
    --target-port 3000 `
    --ingress external `
    --registry-server "$ACR_NAME.azurecr.io" `
    --registry-username $ACR_USERNAME `
    --registry-password "$ACR_PASSWORD" `
    --env-vars APP_NAME=ppaz_api_gateway PORT=3000 HOST=0.0.0.0 PPP_CORE_HOST="$CORE_FQDN" PPP_CORE_PORT=443 PPP_COMPANIAS_HOST="$COMPANIAS_FQDN" PPP_COMPANIAS_PORT=443 NODE_ENV=production LOG_LEVEL=info DATABASE_URL_CORE="$DB_CORE" DATABASE_URL_COMPANIAS="$DB_COMPANIAS" SWAGGER_TITLE="PPP API Gateway - Produccion" SWAGGER_VERSION=1.0 SWAGGER_PATH=api/docs RATE_LIMIT_TTL=60 RATE_LIMIT_MAX=100 `
    --cpu 0.5 `
    --memory 1Gi `
    --min-replicas 1 `
    --max-replicas 5

if ($LASTEXITCODE -eq 0) {
    Write-Success "API Gateway desplegado"
} else {
    Write-Error "Error al desplegar API Gateway"
    exit 1
}

Write-Info ""

# ============================================
# PASO 6: OBTENER INFORMACION DE DESPLIEGUE
# ============================================

Write-Info "PASO 6: Obteniendo informacion del despliegue"
Write-Info ""

$GATEWAY_URL = (az containerapp show --name ppaz-api-gateway --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)

Write-Info ""
Write-Success "============================================"
Write-Success "DESPLIEGUE COMPLETADO EXITOSAMENTE!"
Write-Success "============================================"
Write-Info ""
Write-Success "URLs de acceso:"
Write-Info ""
Write-Success "   API Gateway: https://$GATEWAY_URL"
Write-Success "   Swagger UI:  https://$GATEWAY_URL/api/docs"
Write-Success "   Health Check: https://$GATEWAY_URL/health"
Write-Info ""
Write-Info "Microservicios internos (no accesibles publicamente):"
Write-Info "   - ppp_core: https://$CORE_FQDN"
Write-Info "   - ppp_companias: https://$COMPANIAS_FQDN"
Write-Info ""
Write-Info "Informacion de recursos:"
Write-Info "   - Resource Group: $RESOURCE_GROUP"
Write-Info "   - Location: $LOCATION"
Write-Info "   - Container Registry: $ACR_NAME.azurecr.io"
Write-Info ""
Write-Info "Comandos utiles:"
Write-Info ""
Write-Info "   # Ver logs del API Gateway"
Write-Info "   az containerapp logs show --name ppaz-api-gateway --resource-group $RESOURCE_GROUP --follow"
Write-Info ""
Write-Info "   # Ver logs de ppp_core"
Write-Info "   az containerapp logs show --name ppp-core-service --resource-group $RESOURCE_GROUP --follow"
Write-Info ""
Write-Info "   # Actualizar imagen"
Write-Info "   az containerapp update --name ppaz-api-gateway --resource-group $RESOURCE_GROUP --image ${ACR_NAME}.azurecr.io/ppaz-gateway:latest"
Write-Info ""
Write-Info "   # Escalar replicas"
Write-Info "   az containerapp update --name ppaz-api-gateway --resource-group $RESOURCE_GROUP --min-replicas 2 --max-replicas 10"
Write-Info ""

# Guardar informacion en archivo
$deploymentInfo = @"
INFORMACION DE DESPLIEGUE - $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
=======================================================

URLS PUBLICAS:
- API Gateway: https://$GATEWAY_URL
- Swagger UI:  https://$GATEWAY_URL/api/docs
- Health Check: https://$GATEWAY_URL/health

MICROSERVICIOS INTERNOS:
- ppp_core: https://$CORE_FQDN
- ppp_companias: https://$COMPANIAS_FQDN

RECURSOS AZURE:
- Resource Group: $RESOURCE_GROUP
- Location: $LOCATION
- Container Registry: $ACR_NAME.azurecr.io
- Environment: $ENVIRONMENT

CONTAINER APPS:
- ppaz-api-gateway (publico)
- ppp-core-service (interno)
- ppp-companias-service (interno)
"@

$deploymentInfo | Out-File -FilePath "deployment-info.txt" -Encoding UTF8
Write-Success "Informacion guardada en: deployment-info.txt"
Write-Info ""

# Test rapido
Write-Info "Realizando test rapido..."
try {
    $response = Invoke-WebRequest -Uri "https://$GATEWAY_URL/health/live" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Success "API Gateway responde correctamente!"
    }
} catch {
    Write-Warning "No se pudo conectar al health check (puede tardar unos minutos en estar disponible)"
}

Write-Info ""
Write-Success "Despliegue completado! Prueba tu API en: https://$GATEWAY_URL/api/docs"
Write-Info ""
