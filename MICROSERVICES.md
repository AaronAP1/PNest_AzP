# 🚀 Arquitectura de Microservicios - PNest_AzP

## 📋 Descripción

Este proyecto utiliza una arquitectura de microservicios con NestJS, compuesta por:

- **ppaz-api-gateway** (Puerto 3000): API Gateway HTTP que expone endpoints REST
- **ppp_core** (Puerto 3001): Microservicio TCP para lógica del core
- **ppp_compañias** (Puerto 3002): Microservicio TCP para gestión de compañías

## 🏗️ Arquitectura

```
┌─────────────────────┐
│  ppaz-api-gateway   │ ← HTTP REST API (Puerto 3000)
│   (API Gateway)     │
└──────────┬──────────┘
           │
           ├──────────────────┐
           │                  │
           ▼                  ▼
    ┌─────────────┐    ┌──────────────────┐
    │  ppp_core   │    │ ppp_compañias    │
    │ Puerto 3001 │    │  Puerto 3002     │
    └─────────────┘    └──────────────────┘
         TCP                  TCP
```

## 🔧 Configuración Actual

### 1. ppp_core (Microservicio)
- **Puerto**: 3001
- **Transporte**: TCP
- **Endpoints disponibles**:
  - `{ cmd: 'get_hello_core' }` - Saludo básico
  - `{ cmd: 'get_core_data' }` - Obtener datos del core

### 2. ppp_compañias (Microservicio)
- **Puerto**: 3002
- **Transporte**: TCP
- **Endpoints disponibles**:
  - `{ cmd: 'get_hello_companias' }` - Saludo básico
  - `{ cmd: 'get_all_companies' }` - Listar todas las compañías
  - `{ cmd: 'get_company_by_id' }` - Obtener compañía por ID

### 3. ppaz-api-gateway (API Gateway)
- **Puerto**: 3000
- **Tipo**: Aplicación HTTP REST
- **Clientes registrados**:
  - `PPP_CORE_SERVICE` → localhost:3001
  - `PPP_COMPANIAS_SERVICE` → localhost:3002

## 🚀 Cómo Ejecutar

### Opción 1: Ejecutar todos los servicios en terminales separados

**Terminal 1 - Core Service:**
```powershell
npm run start:dev ppp_core
```

**Terminal 2 - Compañías Service:**
```powershell
npm run start:dev ppp_compañias
```

**Terminal 3 - API Gateway:**
```powershell
npm run start:dev ppaz-api-gateway
```

### Opción 2: Ejecutar en modo producción

```powershell
# Compilar todos los proyectos
npm run build

# Ejecutar cada servicio
node dist/apps/ppp_core/main.js
node dist/apps/ppp_compañias/main.js
node dist/apps/ppaz-api-gateway/main.js
```

## 🧪 Probar los Endpoints

Una vez que todos los servicios estén corriendo, puedes probar los siguientes endpoints:

### API Gateway
```powershell
# Endpoint principal del gateway
curl http://localhost:3000

# Probar ppp_core
curl http://localhost:3000/core/hello
curl http://localhost:3000/core/data

# Probar ppp_compañías
curl http://localhost:3000/companies/hello
curl http://localhost:3000/companies
curl http://localhost:3000/companies/1
```

### Usando PowerShell (Invoke-WebRequest)
```powershell
# Gateway principal
Invoke-WebRequest -Uri http://localhost:3000 | Select-Object -Expand Content

# Core service
Invoke-WebRequest -Uri http://localhost:3000/core/hello | Select-Object -Expand Content
Invoke-WebRequest -Uri http://localhost:3000/core/data | Select-Object -Expand Content

# Compañías service
Invoke-WebRequest -Uri http://localhost:3000/companies | Select-Object -Expand Content
Invoke-WebRequest -Uri http://localhost:3000/companies/1 | Select-Object -Expand Content
```

## 📝 Estructura de Comunicación

### Cliente (HTTP) → API Gateway
```
GET http://localhost:3000/companies
```

### API Gateway → Microservicio
```typescript
this.companiasClient.send(
  { cmd: 'get_all_companies' }, 
  {}
)
```

### Microservicio → Respuesta
```typescript
@MessagePattern({ cmd: 'get_all_companies' })
getAllCompanies() {
  return { companies: [...] };
}
```

## 🔍 Cómo Añadir Nuevos Endpoints

### 1. En el Microservicio (ppp_core o ppp_compañias)

```typescript
// En el controller del microservicio
@MessagePattern({ cmd: 'nuevo_comando' })
nuevoMetodo(data: any) {
  return { 
    resultado: 'datos procesados',
    data 
  };
}
```

### 2. En el API Gateway

```typescript
// En ppaz-api-gateway.controller.ts
@Get('ruta/personalizada')
getRutaPersonalizada(): Observable<any> {
  return this.coreClient.send(
    { cmd: 'nuevo_comando' }, 
    { parametros: 'valor' }
  );
}
```

## 🛠️ Troubleshooting

### Error: "ECONNREFUSED" o no puede conectar
- Asegúrate de que todos los microservicios estén corriendo ANTES de iniciar el gateway
- Verifica que los puertos 3000, 3001 y 3002 estén disponibles

### Ver los puertos en uso:
```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :3002
```

### Orden de inicio recomendado:
1. ✅ Iniciar `ppp_core` (puerto 3001)
2. ✅ Iniciar `ppp_compañias` (puerto 3002)
3. ✅ Iniciar `ppaz-api-gateway` (puerto 3000)

## 📚 Recursos Adicionales

- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [TCP Transport](https://docs.nestjs.com/microservices/tcp)
- [Message Patterns](https://docs.nestjs.com/microservices/basics#request-response)

## ⚡ Próximos Pasos

- [ ] Agregar validación de datos (DTOs)
- [ ] Implementar manejo de errores
- [ ] Agregar logging centralizado
- [ ] Configurar variables de entorno
- [ ] Implementar autenticación/autorización
- [ ] Agregar base de datos
- [ ] Implementar patrones de Event-Driven
