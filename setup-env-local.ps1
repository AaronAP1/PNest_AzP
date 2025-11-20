# ============================================================
# SCRIPT: Configurar variables de entorno para desarrollo local
# ============================================================

Write-Host "`n━━━ CONFIGURANDO VARIABLES DE ENTORNO ━━━`n" -ForegroundColor Cyan

# Credenciales PostgreSQL Azure
$PG_HOST = "ppp-postgres-local.postgres.database.azure.com"
$PG_USER = "pppadmin"
$PG_PASS = "PppSecure2025!"
$PG_PORT = "5432"

# Configurar variables de entorno
Write-Host "[1/4] Configurando ppp_companias..." -ForegroundColor Yellow
[System.Environment]::SetEnvironmentVariable("DATABASE_URL_CORE", "postgresql://$PG_USER`:$PG_PASS@$PG_HOST`:$PG_PORT/ppp_companias?sslmode=require", "User")

Write-Host "[2/4] Configurando ppp_auth..." -ForegroundColor Yellow
[System.Environment]::SetEnvironmentVariable("DATABASE_URL_AUTH", "postgresql://$PG_USER`:$PG_PASS@$PG_HOST`:$PG_PORT/ppp_auth?sslmode=require", "User")

Write-Host "[3/4] Configurando ppp_evaluaciones..." -ForegroundColor Yellow
[System.Environment]::SetEnvironmentVariable("DATABASE_URL_EVALUACIONES", "postgresql://$PG_USER`:$PG_PASS@$PG_HOST`:$PG_PORT/ppp_evaluaciones?sslmode=require", "User")

Write-Host "[4/4] Configurando variables comunes..." -ForegroundColor Yellow
[System.Environment]::SetEnvironmentVariable("NODE_ENV", "development", "User")
[System.Environment]::SetEnvironmentVariable("JWT_SECRET", "your-super-secret-jwt-key-change-in-production", "User")
[System.Environment]::SetEnvironmentVariable("SUNAT_API_TOKEN", "sk_11565.84mnn3NouKcJF0DL7B7RBOpHDkVtwSKO", "User")
[System.Environment]::SetEnvironmentVariable("SUNAT_API_URL", "https://api.decolecta.com/v1", "User")

# Hosts locales
[System.Environment]::SetEnvironmentVariable("PPP_CORE_HOST", "localhost", "User")
[System.Environment]::SetEnvironmentVariable("PPP_CORE_PORT", "3001", "User")
[System.Environment]::SetEnvironmentVariable("PPP_COMPANIAS_HOST", "localhost", "User")
[System.Environment]::SetEnvironmentVariable("PPP_COMPANIAS_PORT", "3003", "User")
[System.Environment]::SetEnvironmentVariable("PPP_AUTH_HOST", "localhost", "User")
[System.Environment]::SetEnvironmentVariable("PPP_AUTH_PORT", "3002", "User")
[System.Environment]::SetEnvironmentVariable("PPP_EVALUACIONES_HOST", "localhost", "User")
[System.Environment]::SetEnvironmentVariable("PPP_EVALUACIONES_PORT", "3004", "User")

Write-Host "`n✅ Variables de entorno configuradas" -ForegroundColor Green
Write-Host "`n📋 CREDENCIALES POSTGRESQL AZURE:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Host    : $PG_HOST" -ForegroundColor White
Write-Host "User    : $PG_USER" -ForegroundColor White
Write-Host "Password: $PG_PASS" -ForegroundColor White
Write-Host "Port    : $PG_PORT" -ForegroundColor White
Write-Host "`nBases de datos creadas:" -ForegroundColor Cyan
Write-Host "  • ppp_companias" -ForegroundColor Gray
Write-Host "  • ppp_core" -ForegroundColor Gray
Write-Host "  • ppp_auth" -ForegroundColor Gray
Write-Host "  • ppp_evaluaciones" -ForegroundColor Gray

Write-Host "`nIMPORTANTE: Reinicia el terminal para cargar las variables`n" -ForegroundColor Yellow
