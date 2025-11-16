# Script simplificado para crear las 4 bases de datos
$serverName = "psql-upeu-ppp-5628"
$resourceGroup = "rg-upeu-ppp-students"

$databases = @("ppp_auth_db", "ppp_academic_db", "ppp_core_db", "ppp_evaluaciones_db")

Write-Host "=== Creando 4 Bases de Datos en Azure ===" -ForegroundColor Cyan
Write-Host "Servidor: $serverName" -ForegroundColor Yellow
Write-Host "Resource Group: $resourceGroup" -ForegroundColor Yellow
Write-Host ""

foreach ($db in $databases) {
    Write-Host "Creando: $db..." -ForegroundColor Green
    
    az postgres flexible-server db create `
        --resource-group $resourceGroup `
        --server-name $serverName `
        --database-name $db
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK - $db creada exitosamente" -ForegroundColor Green
    } else {
        Write-Host "  ERROR al crear $db" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "=== Proceso Completado ===" -ForegroundColor Cyan
