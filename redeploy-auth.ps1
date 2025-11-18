# Redesplegar Auth Service con Swagger Fix
$ErrorActionPreference = "Stop"

Write-Host "`n=== REDESPLIEGUE AUTH SERVICE - SWAGGER FIX ===" -ForegroundColor Cyan

# Build
Write-Host "`n[1/4] Building..." -ForegroundColor Yellow
docker build -t acrpppnest3008.azurecr.io/ppp-auth-service:latest -f apps/ppp-auth-service/Dockerfile .

if ($LASTEXITCODE -ne 0) { 
    Write-Host "Error en build" -ForegroundColor Red
    exit 1 
}

# Login ACR
Write-Host "`n[2/4] Login ACR..." -ForegroundColor Yellow
az acr login --name acrpppnest3008

# Push
Write-Host "`n[3/4] Push..." -ForegroundColor Yellow
docker push acrpppnest3008.azurecr.io/ppp-auth-service:latest

if ($LASTEXITCODE -ne 0) { 
    Write-Host "Error en push" -ForegroundColor Red
    exit 1 
}

# Update
Write-Host "`n[4/4] Update Container App..." -ForegroundColor Yellow
az containerapp update `
  --name ppp-auth-service `
  --resource-group rg-ppp-microservices `
  --image acrpppnest3008.azurecr.io/ppp-auth-service:latest

if ($LASTEXITCODE -ne 0) { 
    Write-Host "Error en update" -ForegroundColor Red
    exit 1 
}

Write-Host "`n=== COMPLETADO ===" -ForegroundColor Green
Write-Host "Swagger: https://ppaz-api-gateway.whitesand-5e7ae56f.brazilsouth.azurecontainerapps.io/docs`n"
