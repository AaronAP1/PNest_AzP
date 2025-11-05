# 🚀 Guía Rápida de Pruebas

## Paso 1: Iniciar Servicios (3 terminales separadas)

### Terminal 1:
```powershell
npm run start:dev ppp_core
```
Espera ver: **"Microservice is listening on port 3001"**

### Terminal 2:
```powershell
npm run start:dev ppp_compañias
```
Espera ver: **"Microservice is listening on port 3002"**

### Terminal 3:
```powershell
npm run start:dev ppaz-api-gateway
```
Espera ver: **"Application is running on: http://localhost:3000"**

---

## Paso 2: Probar Endpoints (en una 4ta terminal)

### Opción A: Con PowerShell (Invoke-WebRequest)

```powershell
# Probar gateway principal
Invoke-WebRequest -Uri http://localhost:3000 | Select-Object -Expand Content

# Probar ppp_core
Invoke-WebRequest -Uri http://localhost:3000/core/hello | Select-Object -Expand Content
Invoke-WebRequest -Uri http://localhost:3000/core/data | Select-Object -Expand Content

# Probar ppp_compañías
Invoke-WebRequest -Uri http://localhost:3000/companies/hello | Select-Object -Expand Content
Invoke-WebRequest -Uri http://localhost:3000/companies | Select-Object -Expand Content
Invoke-WebRequest -Uri http://localhost:3000/companies/1 | Select-Object -Expand Content
Invoke-WebRequest -Uri http://localhost:3000/companies/2 | Select-Object -Expand Content
```

### Opción B: Con curl (si lo tienes instalado)

```powershell
curl http://localhost:3000
curl http://localhost:3000/core/hello
curl http://localhost:3000/core/data
curl http://localhost:3000/companies
curl http://localhost:3000/companies/1
```

### Opción C: Con el navegador

Abre tu navegador y visita:
- http://localhost:3000
- http://localhost:3000/companies
- http://localhost:3000/companies/1
- http://localhost:3000/core/data

---

## 📊 Resultados Esperados

### GET http://localhost:3000
```json
"Hello World!"
```

### GET http://localhost:3000/companies
```json
{
  "message": "Lista de compañías",
  "companies": [
    { "id": 1, "name": "Compañía A", "ruc": "20123456789" },
    { "id": 2, "name": "Compañía B", "ruc": "20987654321" }
  ]
}
```

### GET http://localhost:3000/companies/1
```json
{
  "id": 1,
  "name": "Compañía 1",
  "ruc": "2012345671 9",
  "address": "Dirección de ejemplo"
}
```

### GET http://localhost:3000/core/data
```json
{
  "message": "Datos desde ppp_core",
  "receivedData": { "info": "Solicitud desde Gateway" },
  "timestamp": "2025-11-05T..."
}
```

---

## ⚠️ Solución de Problemas

### Error: "ECONNREFUSED" o conexión rechazada
**Causa**: Los microservicios no están corriendo.
**Solución**: Asegúrate de iniciar los servicios en este orden:
1. ppp_core (puerto 3001)
2. ppp_compañias (puerto 3002)  
3. ppaz-api-gateway (puerto 3000)

### Error: "Port already in use"
**Causa**: El puerto ya está siendo usado.
**Solución**: 
```powershell
# Ver qué proceso está usando el puerto
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :3002

# Matar el proceso (reemplaza PID con el número que aparece)
taskkill /PID <número> /F
```

### Los cambios no se reflejan
**Causa**: El modo watch no detectó los cambios.
**Solución**: Detén el servicio (Ctrl+C) y vuelve a iniciarlo.

---

## 🎯 Scripts Disponibles

```powershell
# Desarrollo (con hot reload)
npm run start:dev ppp_core
npm run start:dev ppp_compañias
npm run start:dev ppaz-api-gateway

# Producción
npm run build
node dist/apps/ppp_core/main.js
node dist/apps/ppp_compañias/main.js
node dist/apps/ppaz-api-gateway/main.js

# Ver todos los scripts disponibles
npm run
```
