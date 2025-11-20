# Configurar variables de entorno para desarrollo local
Write-Host "`nConfigurando variables de entorno..." -ForegroundColor Cyan

# PostgreSQL
$env:DATABASE_URL_CORE = "postgresql://pppadmin:PppSecure2025!@ppp-postgres-local.postgres.database.azure.com:5432/ppp_companias?sslmode=require"
$env:DATABASE_URL_AUTH = "postgresql://pppadmin:PppSecure2025!@ppp-postgres-local.postgres.database.azure.com:5432/ppp_auth?sslmode=require"
$env:DATABASE_URL_EVALUACIONES = "postgresql://pppadmin:PppSecure2025!@ppp-postgres-local.postgres.database.azure.com:5432/ppp_evaluaciones?sslmode=require"

# Hosts
$env:PPP_CORE_HOST = "localhost"
$env:PPP_CORE_PORT = "3001"
$env:PPP_COMPANIAS_HOST = "localhost"
$env:PPP_COMPANIAS_PORT = "3003"
$env:PPP_AUTH_HOST = "localhost"
$env:PPP_AUTH_PORT = "3002"
$env:PPP_EVALUACIONES_HOST = "localhost"
$env:PPP_EVALUACIONES_PORT = "3004"

# Config
$env:NODE_ENV = "development"
$env:JWT_SECRET = "your-super-secret-jwt-key-change-in-production"
$env:SUNAT_API_TOKEN = "sk_11565.84mnn3NouKcJF0DL7B7RBOpHDkVtwSKO"
$env:SUNAT_API_URL = "https://api.decolecta.com/v1"

Write-Host "Variables configuradas para esta sesion" -ForegroundColor Green
Write-Host "`nHost: ppp-postgres-local.postgres.database.azure.com" -ForegroundColor White
Write-Host "User: pppadmin" -ForegroundColor White
Write-Host "Pass: PppSecure2025!" -ForegroundColor White
Write-Host "`nBases de datos: ppp_companias, ppp_core, ppp_auth, ppp_evaluaciones`n" -ForegroundColor White
