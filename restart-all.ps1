# ====================================
# REINICIO COMPLETO DE SERVICIOS
# ====================================

Write-Host "Deteniendo TODOS los procesos Node.js..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Iniciando servicios en orden..." -ForegroundColor Green
Write-Host ""

# PPP Core
Write-Host "1. Iniciando PPP_CORE en puerto 3002..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run start:dev ppp_core"
Start-Sleep -Seconds 8

# PPP Compañías
Write-Host "2. Iniciando PPP_COMPANIAS en puerto 3003..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run start:dev ppp_compañias"
Start-Sleep -Seconds 8

# PPP Auth
Write-Host "3. Iniciando PPP_AUTH en puerto 3001..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run start:dev ppp-auth-service"
Start-Sleep -Seconds 8

# PPP Evaluaciones
Write-Host "4. Iniciando PPP_EVALUACIONES en puerto 3004..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run start:dev ppp-evaluaciones-service"
Start-Sleep -Seconds 8

# API Gateway
Write-Host "5. Iniciando API_GATEWAY en puerto 3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run start:dev ppaz-api-gateway"
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "✅ SERVICIOS INICIADOS" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Puertos asignados:" -ForegroundColor White
Write-Host "  Gateway:     http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Auth:        http://localhost:3001" -ForegroundColor Gray
Write-Host "  Core:        http://localhost:3002" -ForegroundColor Gray
Write-Host "  Compañías:   http://localhost:3003" -ForegroundColor Gray
Write-Host "  Evaluaciones: http://localhost:3004" -ForegroundColor Gray
Write-Host ""
Write-Host "Prueba: http://localhost:3000/facultades" -ForegroundColor Yellow
