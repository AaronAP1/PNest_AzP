# ==========================================
# Azure Deployment Configuration
# ==========================================

# Instrucciones para desplegar en Azure App Service

## PREREQUISITES
1. Azure CLI instalado: https://docs.microsoft.com/cli/azure/install-azure-cli
2. Cuenta de Azure activa
3. Resource Group creado en Azure
4. Azure PostgreSQL Flexible Server configurado

## PASOS PARA DESPLEGAR

### 1. Crear App Services en Azure Portal

#### App Service para ppp_core:
```bash
az webapp create \
  --resource-group <your-resource-group> \
  --plan <your-app-service-plan> \
  --name ppp-core-service \
  --runtime "NODE:18-lts"
```

#### App Service para ppp_companias:
```bash
az webapp create \
  --resource-group <your-resource-group> \
  --plan <your-app-service-plan> \
  --name ppp-companias-service \
  --runtime "NODE:18-lts"
```

#### App Service para API Gateway:
```bash
az webapp create \
  --resource-group <your-resource-group> \
  --plan <your-app-service-plan> \
  --name ppaz-api-gateway \
  --runtime "NODE:18-lts"
```

### 2. Configurar Variables de Entorno en cada App Service

#### Para ppp-core-service:
```bash
az webapp config appsettings set \
  --resource-group <your-resource-group> \
  --name ppp-core-service \
  --settings \
    DATABASE_URL_CORE="<your-connection-string>" \
    APP_NAME="ppp_core" \
    PORT=8080 \
    HOST="0.0.0.0" \
    NODE_ENV="production" \
    LOG_LEVEL="info" \
    WEBSITE_NODE_DEFAULT_VERSION="~18"
```

#### Para ppp-companias-service:
```bash
az webapp config appsettings set \
  --resource-group <your-resource-group> \
  --name ppp-companias-service \
  --settings \
    DATABASE_URL_COMPANIAS="<your-connection-string>" \
    APP_NAME="ppp_companias" \
    PORT=8080 \
    HOST="0.0.0.0" \
    NODE_ENV="production" \
    LOG_LEVEL="info" \
    WEBSITE_NODE_DEFAULT_VERSION="~18"
```

#### Para ppaz-api-gateway:
```bash
az webapp config appsettings set \
  --resource-group <your-resource-group> \
  --name ppaz-api-gateway \
  --settings \
    APP_NAME="ppaz_api_gateway" \
    PORT=8080 \
    HOST="0.0.0.0" \
    PPP_CORE_HOST="ppp-core-service.azurewebsites.net" \
    PPP_CORE_PORT=443 \
    PPP_COMPANIAS_HOST="ppp-companias-service.azurewebsites.net" \
    PPP_COMPANIAS_PORT=443 \
    DATABASE_URL_CORE="<your-connection-string>" \
    DATABASE_URL_COMPANIAS="<your-connection-string>" \
    NODE_ENV="production" \
    SWAGGER_TITLE="PPP API Gateway" \
    SWAGGER_DESCRIPTION="API Gateway - Sistema PPP" \
    SWAGGER_VERSION="1.0" \
    SWAGGER_PATH="api/docs" \
    RATE_LIMIT_TTL=60 \
    RATE_LIMIT_MAX=100 \
    LOG_LEVEL="info" \
    WEBSITE_NODE_DEFAULT_VERSION="~18"
```

### 3. Configurar para monorepo NestJS

Crear archivo `azure-pipelines.yml` en la raíz:

```yaml
trigger:
  - master

pool:
  vmImage: 'ubuntu-latest'

variables:
  - name: nodeVersion
    value: '18.x'

stages:
  - stage: Build
    jobs:
      - job: BuildCore
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)
          - script: npm install
          - script: npm run build ppp_core
          - task: CopyFiles@2
            inputs:
              SourceFolder: 'dist/apps/ppp_core'
              Contents: '**'
              TargetFolder: '$(Build.ArtifactStagingDirectory)/ppp_core'
          - task: PublishBuildArtifacts@1
            inputs:
              PathtoPublish: '$(Build.ArtifactStagingDirectory)/ppp_core'
              ArtifactName: 'ppp_core'

      - job: BuildCompanias
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)
          - script: npm install
          - script: npm run build ppp_compañias
          - task: CopyFiles@2
            inputs:
              SourceFolder: 'dist/apps/ppp_compañias'
              Contents: '**'
              TargetFolder: '$(Build.ArtifactStagingDirectory)/ppp_companias'
          - task: PublishBuildArtifacts@1
            inputs:
              PathtoPublish: '$(Build.ArtifactStagingDirectory)/ppp_companias'
              ArtifactName: 'ppp_companias'

      - job: BuildGateway
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)
          - script: npm install
          - script: npm run build ppaz-api-gateway
          - task: CopyFiles@2
            inputs:
              SourceFolder: 'dist/apps/ppaz-api-gateway'
              Contents: '**'
              TargetFolder: '$(Build.ArtifactStagingDirectory)/gateway'
          - task: PublishBuildArtifacts@1
            inputs:
              PathtoPublish: '$(Build.ArtifactStagingDirectory)/gateway'
              ArtifactName: 'gateway'

  - stage: Deploy
    dependsOn: Build
    jobs:
      - deployment: DeployCore
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: '<your-subscription>'
                    appName: 'ppp-core-service'
                    package: '$(Pipeline.Workspace)/ppp_core'

      - deployment: DeployCompanias
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: '<your-subscription>'
                    appName: 'ppp-companias-service'
                    package: '$(Pipeline.Workspace)/ppp_companias'

      - deployment: DeployGateway
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: '<your-subscription>'
                    appName: 'ppaz-api-gateway'
                    package: '$(Pipeline.Workspace)/gateway'
```

### 4. Deployment Manual alternativo

Si prefieres deployment manual con GitHub Actions:

```bash
# 1. Construir el proyecto
npm run build ppp_core
npm run build ppp_compañias
npm run build ppaz-api-gateway

# 2. Deploy usando az CLI
cd dist/apps/ppp_core
zip -r ppp_core.zip .
az webapp deployment source config-zip \
  --resource-group <your-resource-group> \
  --name ppp-core-service \
  --src ppp_core.zip

# Repetir para los otros servicios
```

### 5. Verificar Health Checks después del deploy

```bash
# Check ppp_core
curl https://ppp-core-service.azurewebsites.net/health

# Check ppp_companias
curl https://ppp-companias-service.azurewebsites.net/health

# Check API Gateway
curl https://ppaz-api-gateway.azurewebsites.net/health
```

### 6. Configurar Application Insights (Recomendado)

```bash
# Crear Application Insights
az monitor app-insights component create \
  --app ppp-insights \
  --location <your-location> \
  --resource-group <your-resource-group>

# Obtener instrumentation key
az monitor app-insights component show \
  --app ppp-insights \
  --resource-group <your-resource-group> \
  --query instrumentationKey

# Agregar a App Settings de cada servicio
az webapp config appsettings set \
  --name <app-service-name> \
  --resource-group <your-resource-group> \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY="<key>"
```

## IMPORTANT NOTES

1. **TCP Transport en Azure**: Los microservicios usan TCP. En Azure necesitas:
   - Cambiar a HTTP transport para comunicación entre App Services
   - O usar Azure Service Bus para messaging
   - O usar Azure Container Apps con redes virtuales

2. **HTTPS**: Azure App Service usa HTTPS por defecto. Actualiza PPP_CORE_PORT y PPP_COMPANIAS_PORT a 443.

3. **Database Connection**: Asegúrate que Azure PostgreSQL permite conexiones desde Azure services.

4. **Logs**: Habilita Application Logging en Azure Portal para debugging.

5. **Scaling**: Configura auto-scaling en App Service Plan según la carga.

## ALTERNATIVE: Azure Container Apps (Recomendado para microservicios)

Para mejor soporte de TCP y service-to-service communication:

```bash
# Container Apps soporta mejor arquitectura de microservicios
az containerapp env create \
  --name ppp-env \
  --resource-group <your-resource-group> \
  --location <your-location>

# Entonces deploy cada servicio como container app
# Esto permite TCP nativo y service discovery
```
