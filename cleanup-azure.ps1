# ============================================
# SCRIPT DE LIMPIEZA DE RECURSOS AZURE
# Elimina todos los recursos creados
# ============================================

# Colores para output
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Error { Write-Host $args -ForegroundColor Red }

Write-Warning "============================================"
Write-Warning "⚠️  LIMPIEZA DE RECURSOS AZURE"
Write-Warning "============================================"
Write-Info ""

# Leer información del despliegue anterior
if (Test-Path "deployment-info.txt") {
    $content = Get-Content "deployment-info.txt" -Raw
    
    if ($content -match 'Resource Group: (.+)') {
        $RESOURCE_GROUP = $matches[1].Trim()
    } else {
        $RESOURCE_GROUP = $null
    }
    
    if ($RESOURCE_GROUP) {
        Write-Info "Resource Group encontrado: $RESOURCE_GROUP"
        Write-Info ""
    } else {
        Write-Error "❌ No se pudo leer la configuración"
        $RESOURCE_GROUP = Read-Host "Ingresa el nombre del Resource Group"
    }
} else {
    Write-Warning "⚠️  No se encontró deployment-info.txt"
    $RESOURCE_GROUP = Read-Host "Ingresa el nombre del Resource Group"
}

# Mostrar recursos que se eliminarán
Write-Warning "Los siguientes recursos serán ELIMINADOS PERMANENTEMENTE:"
Write-Info ""
az resource list --resource-group $RESOURCE_GROUP --output table
Write-Info ""

# Confirmar eliminación
Write-Warning "⚠️  ESTA ACCIÓN NO SE PUEDE DESHACER ⚠️"
$confirm = Read-Host "¿Estás seguro que deseas eliminar todos estos recursos? (escribe 'ELIMINAR' para confirmar)"

if ($confirm -ne "ELIMINAR") {
    Write-Info "❌ Operación cancelada"
    exit
}

Write-Info ""
Write-Info "Eliminando Resource Group y todos sus recursos..."
Write-Info "Esto puede tardar varios minutos..."

az group delete --name $RESOURCE_GROUP --yes --no-wait

Write-Success "✅ Solicitud de eliminación enviada"
Write-Info ""
Write-Info "Los recursos se están eliminando en segundo plano."
Write-Info "Puedes verificar el progreso con:"
Write-Info "   az group show --name $RESOURCE_GROUP"
Write-Info ""
Write-Info "Una vez completado, el comando anterior devolverá un error 'ResourceGroupNotFound'."
Write-Info ""
