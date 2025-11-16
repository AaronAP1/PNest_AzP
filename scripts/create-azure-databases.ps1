# ==============================================================================
# Script: Crear Bases de Datos en Azure PostgreSQL
# Propósito: Crear las 4 bases de datos necesarias para el sistema PPP
# ==============================================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerName,
    
    [Parameter(Mandatory=$true)]
    [string]$AdminUser,
    
    [Parameter(Mandatory=$true)]
    [string]$AdminPassword,
    
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroup = "ppp-resources"
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Creando Bases de Datos en Azure" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Configuración
$databases = @(
    @{Name="ppp_auth_db"; Description="Base de datos de autenticación y usuarios"},
    @{Name="ppp_academic_db"; Description="Base de datos académica (facultades, escuelas, alumnos)"},
    @{Name="ppp_core_db"; Description="Base de datos principal (empresas, solicitudes, documentos)"},
    @{Name="ppp_evaluaciones_db"; Description="Base de datos de evaluaciones"}
)

# Variables de conexión
$serverFQDN = "$ServerName.postgres.database.azure.com"

Write-Host "Servidor: $serverFQDN" -ForegroundColor Yellow
Write-Host "Usuario Admin: $AdminUser" -ForegroundColor Yellow
Write-Host ""

# Función para crear base de datos
function Create-Database {
    param(
        [string]$DbName,
        [string]$Description
    )
    
    Write-Host "📦 Creando base de datos: $DbName" -ForegroundColor Green
    Write-Host "   Descripción: $Description" -ForegroundColor Gray
    
    try {
        # Usar Azure CLI para crear la base de datos
        az postgres flexible-server db create `
            --resource-group $ResourceGroup `
            --server-name $ServerName `
            --database-name $DbName `
            --charset UTF8 `
            --collation en_US.utf8
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Base de datos '$DbName' creada exitosamente" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Error al crear base de datos '$DbName'" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "   ❌ Excepción: $_" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Verificar que Azure CLI esté instalado
Write-Host "🔍 Verificando Azure CLI..." -ForegroundColor Cyan
try {
    $azVersion = az version --output json | ConvertFrom-Json
    Write-Host "   ✅ Azure CLI versión: $($azVersion.'azure-cli')" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Azure CLI no está instalado. Instálalo desde: https://aka.ms/installazurecliwindows" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Login a Azure (si no está autenticado)
Write-Host "🔐 Verificando autenticación en Azure..." -ForegroundColor Cyan
$account = az account show 2>$null
if (-not $account) {
    Write-Host "   No estás autenticado. Iniciando login..." -ForegroundColor Yellow
    az login
}
else {
    Write-Host "   ✅ Ya estás autenticado" -ForegroundColor Green
}

Write-Host ""

# Crear cada base de datos
foreach ($db in $databases) {
    Create-Database -DbName $db.Name -Description $db.Description
    Start-Sleep -Seconds 2
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  ✅ Proceso Completado" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Mostrar resumen
Write-Host "📊 Resumen de bases de datos creadas:" -ForegroundColor Yellow
Write-Host ""
foreach ($db in $databases) {
    Write-Host "   • $($db.Name)" -ForegroundColor White
}

Write-Host ""
Write-Host "🔗 Connection Strings:" -ForegroundColor Yellow
Write-Host ""
foreach ($db in $databases) {
    $dbNameUpper = $db.Name.ToUpper()
    Write-Host "DATABASE_URL_$dbNameUpper=" -NoNewline -ForegroundColor Gray
    Write-Host "postgresql://${AdminUser}:${AdminPassword}@${serverFQDN}:5432/$($db.Name)?schema=public" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "💡 Siguiente paso: Agregar estas variables al archivo .env" -ForegroundColor Green
Write-Host ""
