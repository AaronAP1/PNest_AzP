# ============================================
# Script para crear base de datos pppNest en Azure PostgreSQL
# ============================================

Write-Host "🔧 Creando base de datos 'pppNest' en Azure PostgreSQL..." -ForegroundColor Cyan
Write-Host ""

# Cargar variables de entorno
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"')
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
    Write-Host "✅ Variables de entorno cargadas" -ForegroundColor Green
} else {
    Write-Host "❌ Archivo .env no encontrado" -ForegroundColor Red
    exit 1
}

$DB_HOST = $env:DB_HOST
$DB_USER = $env:DB_USER
$DB_PASSWORD = $env:DB_PASSWORD
$DB_PORT = $env:DB_PORT

Write-Host "📡 Conectando a: $DB_HOST" -ForegroundColor Yellow
Write-Host "👤 Usuario: $DB_USER" -ForegroundColor Yellow
Write-Host ""

# Verificar si psql está instalado
if (!(Get-Command psql -ErrorAction SilentlyContinue)) {
    Write-Host "❌ PostgreSQL CLI (psql) no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Instálalo desde:" -ForegroundColor Yellow
    Write-Host "https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "O usa Azure Data Studio / pgAdmin para ejecutar el script manualmente:" -ForegroundColor Yellow
    Write-Host "scripts/create-azure-database.sql" -ForegroundColor Cyan
    exit 1
}

Write-Host "🚀 Ejecutando script SQL..." -ForegroundColor Cyan

# Ejecutar el comando para crear la base de datos
# Nota: En Azure PostgreSQL, debes conectarte primero a 'postgres' o una DB existente
$env:PGPASSWORD = $DB_PASSWORD

# Crear la base de datos
$createDbCommand = @"
CREATE DATABASE "pppNest"
    WITH 
    OWNER = $DB_USER
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
"@

Write-Host $createDbCommand | psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Base de datos 'pppNest' creada exitosamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
    Write-Host "1. Ejecuta: npx prisma migrate dev --name init" -ForegroundColor White
    Write-Host "2. Esto creará todas las tablas en Azure PostgreSQL" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "⚠️  La base de datos podría ya existir o hubo un error" -ForegroundColor Yellow
    Write-Host "Intenta ejecutar las migraciones de todas formas:" -ForegroundColor Yellow
    Write-Host "npx prisma migrate dev --name init" -ForegroundColor Cyan
}

# Limpiar variable de entorno
Remove-Item Env:PGPASSWORD
