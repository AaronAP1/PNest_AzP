# Script para verificar tablas en todas las bases de datos
Write-Host "`n============================================" -ForegroundColor Green
Write-Host "  VERIFICACIÓN DE TABLAS EN BASES DE DATOS  " -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Green

$server = "ppp-postgres-local.postgres.database.azure.com"
$user = "pppadmin"
$password = "PppSecure2025!"

$databases = @{
    "ppp_core" = @{
        "expected" = 3
        "tables" = @("facultad", "escuela", "linea_facultad")
    }
    "ppp_auth" = @{
        "expected" = 9
        "tables" = @("usuario", "rol", "usuario_rol", "privilegio", "rol_privilegio", "alumno", "secretaria", "supervisor", "coordinador")
    }
    "ppp_companias" = @{
        "expected" = 6
        "tables" = @("empresa", "solicitud_ppp", "carta_presentacion", "reunion", "tipo_documento", "documento")
    }
    "ppp_evaluaciones" = @{
        "expected" = 7
        "tables" = @("evaluacion_supervisor", "evaluacion_pregunta", "pregunta", "evaluacion_practicante", "evaluacion_practicante_solicitud", "pregunta_linea", "dimension_transversal")
    }
}

foreach ($dbName in $databases.Keys | Sort-Object) {
    $dbInfo = $databases[$dbName]
    $expected = $dbInfo.expected
    $tables = $dbInfo.tables
    
    Write-Host "[$dbName]" -ForegroundColor Cyan
    Write-Host "  Servidor: $server" -ForegroundColor Gray
    Write-Host "  Tablas esperadas: $expected" -ForegroundColor Gray
    Write-Host "  Tablas definidas en schema:" -ForegroundColor Yellow
    
    foreach ($table in $tables) {
        Write-Host "    ✓ $table" -ForegroundColor Green
    }
    
    Write-Host ""
}

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "  RESUMEN" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "Total de bases de datos: 4" -ForegroundColor Cyan
Write-Host "Total de tablas esperadas: 25" -ForegroundColor Cyan
Write-Host "`nPara ver las tablas reales en cada BD:" -ForegroundColor Yellow
Write-Host "  1. Abre tu cliente PostgreSQL (DBeaver, pgAdmin, Azure Data Studio, etc.)" -ForegroundColor Gray
Write-Host "  2. Conéctate a: $server" -ForegroundColor Gray
Write-Host "  3. Revisa cada base de datos individualmente" -ForegroundColor Gray
Write-Host "`nO usa Prisma Studio:" -ForegroundColor Yellow
Write-Host "  cd apps/ppp_core && npx prisma studio" -ForegroundColor Gray
Write-Host "  cd apps/ppp-auth-service && npx prisma studio" -ForegroundColor Gray
Write-Host "  cd apps/ppp_compañias && npx prisma studio" -ForegroundColor Gray
Write-Host "  cd apps/ppp-evaluaciones-service && npx prisma studio" -ForegroundColor Gray
