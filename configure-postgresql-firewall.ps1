# Script para configurar el firewall de PostgreSQL para permitir acceso desde Container Apps

Write-Host "Configurando firewall de Azure PostgreSQL..." -ForegroundColor Cyan
Write-Host ""

# Nombre del servidor PostgreSQL (sin el .postgres.database.azure.com)
$PG_SERVER_NAME = "s-ppp-nest"

# IPs salientes de Container Apps
$OUTBOUND_IPS = @(
    "20.226.185.233",
    "20.226.185.243",
    "20.226.186.22",
    "20.226.186.95",
    "4.228.165.239",
    "4.228.166.5",
    "4.228.165.232",
    "4.228.166.105",
    "4.228.166.39",
    "4.228.166.3",
    "20.206.185.144",
    "20.206.187.47",
    "20.206.187.195",
    "20.206.187.185",
    "4.228.135.176",
    "4.228.135.12",
    "4.228.132.91",
    "4.228.134.38",
    "4.228.132.247",
    "4.228.135.14",
    "191.232.170.51",
    "191.232.242.178",
    "4.201.180.126",
    "104.41.36.159",
    "4.201.122.231",
    "4.201.202.182",
    "4.201.202.192",
    "20.206.107.17",
    "191.233.251.124",
    "4.201.180.21",
    "4.203.65.124"
)

Write-Host "Agregando reglas de firewall para ${OUTBOUND_IPS.Count} IPs..." -ForegroundColor Yellow

$counter = 0
foreach ($ip in $OUTBOUND_IPS) {
    $counter++
    $ruleName = "ContainerApp-IP-$counter"
    
    Write-Host "  Agregando regla: $ruleName ($ip)" -ForegroundColor White
    
    az postgres server firewall-rule create `
        --resource-group rg-ppp-microservices `
        --server-name $PG_SERVER_NAME `
        --name $ruleName `
        --start-ip-address $ip `
        --end-ip-address $ip `
        --output none
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✓ Regla creada" -ForegroundColor Green
    } else {
        Write-Host "    ✗ Error al crear regla" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "FIREWALL CONFIGURADO" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Reglas de firewall creadas: $counter" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para verificar las reglas:" -ForegroundColor White
Write-Host "  az postgres server firewall-rule list --resource-group rg-ppp-microservices --server-name s-ppp-nest -o table" -ForegroundColor Gray
Write-Host ""
