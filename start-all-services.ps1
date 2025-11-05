# Script para iniciar todos los microservicios
# Ejecutar con: .\start-all-services.ps1

Write-Host "🚀 Iniciando arquitectura de microservicios..." -ForegroundColor Green
Write-Host ""

# Verificar si Node.js está instalado
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Verificando dependencias..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "📥 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "🎯 Orden de inicio:" -ForegroundColor Cyan
Write-Host "  1. ppp_core (puerto 3001)" -ForegroundColor White
Write-Host "  2. ppp_compañias (puerto 3002)" -ForegroundColor White
Write-Host "  3. ppaz-api-gateway (puerto 3000)" -ForegroundColor White
Write-Host ""

# Crear función para iniciar servicio en nueva ventana
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$Port,
        [string]$Color
    )
    
    Write-Host "▶️  Iniciando $ServiceName en puerto $Port..." -ForegroundColor $Color
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run start:dev $ServiceName"
    
    Start-Sleep -Seconds 3
}

# Iniciar servicios en orden
Start-Service -ServiceName "ppp_core" -Port "3001" -Color "Blue"
Start-Service -ServiceName "ppp_compañias" -Port "3002" -Color "Magenta"
Start-Service -ServiceName "ppaz-api-gateway" -Port "3000" -Color "Green"

Write-Host ""
Write-Host "✅ Todos los servicios han sido iniciados!" -ForegroundColor Green
Write-Host ""
Write-Host "📌 URLs disponibles:" -ForegroundColor Yellow
Write-Host "   API Gateway: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Prueba los endpoints:" -ForegroundColor Yellow
Write-Host "   Invoke-WebRequest http://localhost:3000/companies | Select -Expand Content" -ForegroundColor Gray
Write-Host "   Invoke-WebRequest http://localhost:3000/core/data | Select -Expand Content" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  Para detener los servicios, cierra las ventanas de PowerShell abiertas" -ForegroundColor Yellow
