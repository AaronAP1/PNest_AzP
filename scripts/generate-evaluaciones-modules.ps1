# Script para generar estructura completa de módulos de evaluaciones
# Este script crea todos los archivos necesarios para los 7 módulos CRUD

Write-Host "🚀 Generando módulos completos de evaluaciones-service..." -ForegroundColor Cyan

$modules = @(
    "dimension-transversal",
    "preguntas",
    "evaluacion-supervisor",
    "evaluacion-pregunta",
    "evaluacion-practicante",
    "evaluacion-practicante-solicitud",
    "pregunta-linea"
)

foreach ($module in $modules) {
    Write-Host "`n📦 Creando módulo: $module" -ForegroundColor Yellow
    
    $modulePath = "apps\ppp-evaluaciones-service\src\modules\$module"
    $dtoPath = "$modulePath\dto"
    
    # Crear directorios
    New-Item -Path $modulePath -ItemType Directory -Force | Out-Null
    New-Item -Path $dtoPath -ItemType Directory -Force | Out-Null
    
    Write-Host "   ✅ Estructura creada" -ForegroundColor Green
}

Write-Host "`n✅ Estructura base de todos los módulos creada exitosamente!" -ForegroundColor Green
Write-Host "📝 Ahora generar los archivos TypeScript..." -ForegroundColor Cyan
