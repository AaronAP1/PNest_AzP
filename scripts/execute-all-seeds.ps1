# =============================================
# SCRIPT PARA EJECUTAR TODOS LOS SEEDS
# Ejecuta en el orden correcto todas las inserciones
# =============================================

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  INICIANDO INSERCION DE DATOS DE PRUEBA" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Configuracion de bases de datos AZURE
$pgHost = "ppp-postgres-local.postgres.database.azure.com"
$pgPort = "5432"
$user = "pppadmin"
$password = "PppSecure2025!"

# Nombres de bases de datos
$coreDb = "ppp_core"
$authDb = "ppp_auth"
$companiasDb = "ppp_companias"
$evaluacionesDb = "ppp_evaluaciones"

# Ruta a psql (PostgreSQL debe estar instalado)
$psqlPath = "C:\Program Files\PostgreSQL\16\bin\psql.exe"
if (-not (Test-Path $psqlPath)) {
    $psqlPath = "C:\Program Files\PostgreSQL\15\bin\psql.exe"
}
if (-not (Test-Path $psqlPath)) {
    $psqlPath = "C:\Program Files\PostgreSQL\14\bin\psql.exe"
}
if (-not (Test-Path $psqlPath)) {
    Write-Host "[ERROR] No se encuentra psql.exe. Instala PostgreSQL o agregalo al PATH" -ForegroundColor Red
    exit 1
}

# Configurar password
$env:PGPASSWORD = $password

Write-Host ""
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "PASO 1: Insertando datos en CORE DB" -ForegroundColor Yellow
Write-Host "      (Facultades, Escuelas, Lineas)" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "Host: $pgHost"
Write-Host "Base de datos: $coreDb"
Write-Host "Puerto: $pgPort"
Write-Host ""

try {
    & $psqlPath -h $pgHost -p $pgPort -U $user -d $coreDb -f "scripts/seed-core-database-fixed.sql"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] CORE DB: Datos insertados correctamente" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] en CORE DB" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "[ERROR] ejecutando script de CORE DB: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "PASO 2: Insertando datos en AUTH DB" -ForegroundColor Yellow
Write-Host "      (Roles, Usuarios, Supervisores, Alumnos)" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "Host: $pgHost"
Write-Host "Base de datos: $authDb"
Write-Host "Puerto: $pgPort"
Write-Host ""

try {
    & $psqlPath -h $pgHost -p $pgPort -U $user -d $authDb -f "scripts/seed-auth-database-fixed.sql"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] AUTH DB: Datos insertados correctamente" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] en AUTH DB" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "[ERROR] ejecutando script de AUTH DB: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "PASO 3: Insertando datos en COMPANIAS DB" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "Host: $pgHost"
Write-Host "Base de datos: $companiasDb"
Write-Host "Puerto: $pgPort"
Write-Host ""

try {
    & $psqlPath -h $pgHost -p $pgPort -U $user -d $companiasDb -f "scripts/seed-companias-database-fixed.sql"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] COMPANIAS DB: Datos insertados correctamente" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] en COMPANIAS DB" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "[ERROR] ejecutando script de COMPANIAS DB: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "PASO 4: Insertando datos en EVALUACIONES DB" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "Host: $pgHost"
Write-Host "Base de datos: $evaluacionesDb"
Write-Host "Puerto: $pgPort"
Write-Host ""

try {
    & $psqlPath -h $pgHost -p $pgPort -U $user -d $evaluacionesDb -f "scripts/seed-evaluaciones-database.sql"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] EVALUACIONES DB: Datos insertados correctamente" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] en EVALUACIONES DB" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "[ERROR] ejecutando script de EVALUACIONES DB: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  PROCESO COMPLETADO EXITOSAMENTE" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "RESUMEN DE DATOS INSERTADOS en AZURE:" -ForegroundColor White
Write-Host "  - CORE DB: 18 registros" -ForegroundColor White
Write-Host "    (3 facultades, 5 escuelas, 10 lineas facultad)" -ForegroundColor White
Write-Host "  - AUTH DB: 21 registros" -ForegroundColor White
Write-Host "    (5 roles, 8 usuarios, 3 supervisores, 5 alumnos)" -ForegroundColor White
Write-Host "  - COMPANIAS DB: 30 registros" -ForegroundColor White
Write-Host "    (5 empresas, 5 cartas, 5 solicitudes, 5 reuniones, 5 tipos doc, 5 documentos)" -ForegroundColor White
Write-Host "  - EVALUACIONES DB: 60 registros" -ForegroundColor White
Write-Host "    (10 dimensiones, 10 preguntas, 5 eval_sup, 5 eval_prac, 20 respuestas)" -ForegroundColor White
Write-Host ""
Write-Host "  TOTAL: 129 registros insertados en AZURE PostgreSQL" -ForegroundColor Green
Write-Host ""

# Limpiar password del ambiente
$env:PGPASSWORD = ""
