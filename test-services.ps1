# 🧪 Script de Testing - Microservicios
# Ejecutar DESPUÉS de iniciar todos los servicios

Write-Host "🧪 Probando Microservicios..." -ForegroundColor Cyan
Write-Host ""

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url
    )
    
    Write-Host "📡 Probando: $Name" -ForegroundColor Yellow
    Write-Host "   URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing
        Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "   📄 Respuesta:" -ForegroundColor White
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3 | Write-Host
    }
    catch {
        Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Esperar a que los servicios estén listos
Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Write-Host ""

# Probar API Gateway
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "    PRUEBAS DEL API GATEWAY" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Test-Endpoint -Name "Gateway - Endpoint principal" -Url "http://localhost:3000"

# Probar ppp_core
Write-Host "═══════════════════════════════════════" -ForegroundColor Blue
Write-Host "    PRUEBAS DE PPP_CORE" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════" -ForegroundColor Blue
Write-Host ""

Test-Endpoint -Name "Core - Hello" -Url "http://localhost:3000/core/hello"
Test-Endpoint -Name "Core - Data" -Url "http://localhost:3000/core/data"

# Probar ppp_compañías
Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta
Write-Host "    PRUEBAS DE PPP_COMPAÑÍAS" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

Test-Endpoint -Name "Compañías - Hello" -Url "http://localhost:3000/companies/hello"
Test-Endpoint -Name "Compañías - Listar todas" -Url "http://localhost:3000/companies"
Test-Endpoint -Name "Compañías - Obtener por ID (1)" -Url "http://localhost:3000/companies/1"
Test-Endpoint -Name "Compañías - Obtener por ID (2)" -Url "http://localhost:3000/companies/2"

Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host "    ✅ PRUEBAS COMPLETADAS" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
