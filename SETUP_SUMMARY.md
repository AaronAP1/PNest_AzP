# 📊 Resumen de Configuración - Arquitectura de Microservicios

## ✅ Cambios Realizados

### 1️⃣ **ppp_compañias - Convertido a Microservicio**
**Archivo**: `apps/ppp_compañias/src/main.ts`

```typescript
// ANTES: Aplicación HTTP normal
const app = await NestFactory.create(PppCompañiasModule);
await app.listen(process.env.port ?? 3000);

// DESPUÉS: Microservicio TCP
const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  PppCompañiasModule,
  {
    transport: Transport.TCP,
    options: { port: 3002 }
  }
);
```

### 2️⃣ **ppaz-api-gateway - Registro de Clientes**
**Archivo**: `apps/ppaz-api-gateway/src/ppaz-api-gateway.module.ts`

```typescript
imports: [
  ClientsModule.register([
    {
      name: 'PPP_CORE_SERVICE',
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3001 }
    },
    {
      name: 'PPP_COMPANIAS_SERVICE',
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3002 }
    }
  ])
]
```

### 3️⃣ **Controladores Actualizados**

#### ppp_core.controller.ts
```typescript
@MessagePattern({ cmd: 'get_hello_core' })
@MessagePattern({ cmd: 'get_core_data' })
```

#### ppp_compañias.controller.ts
```typescript
@MessagePattern({ cmd: 'get_hello_companias' })
@MessagePattern({ cmd: 'get_all_companies' })
@MessagePattern({ cmd: 'get_company_by_id' })
```

#### ppaz-api-gateway.controller.ts
```typescript
@Inject('PPP_CORE_SERVICE') private coreClient: ClientProxy
@Inject('PPP_COMPANIAS_SERVICE') private companiasClient: ClientProxy

// Endpoints HTTP que llaman a los microservicios
@Get('core/hello')
@Get('core/data')
@Get('companies')
@Get('companies/:id')
```

## 🔌 Puertos Configurados

| Servicio | Puerto | Tipo | Protocolo |
|----------|--------|------|-----------|
| **ppaz-api-gateway** | 3000 | HTTP REST | Express |
| **ppp_core** | 3001 | Microservicio | TCP |
| **ppp_compañias** | 3002 | Microservicio | TCP |

## 🌐 Endpoints Disponibles

### Gateway (Puerto 3000)

#### Endpoints Generales
- `GET /` - Saludo del gateway

#### Endpoints de Core Service
- `GET /core/hello` - Saludo desde ppp_core
- `GET /core/data` - Obtener datos desde ppp_core

#### Endpoints de Compañías Service
- `GET /companies/hello` - Saludo desde ppp_compañías
- `GET /companies` - Listar todas las compañías
- `GET /companies/:id` - Obtener compañía por ID

## 📡 Flujo de Comunicación

```
┌─────────────┐
│   Cliente   │
│  (Browser)  │
└──────┬──────┘
       │ HTTP Request
       │ GET /companies
       ▼
┌──────────────────────────┐
│   ppaz-api-gateway       │
│   (Puerto 3000)          │
│                          │
│ @Get('companies')        │
│ getAllCompanies() {      │
│   return this            │
│     .companiasClient     │◄─── Inyección del cliente
│     .send({              │
│       cmd: 'get_all...'  │
│     }, {})               │
│ }                        │
└──────────┬───────────────┘
           │ TCP Message
           │ { cmd: 'get_all_companies' }
           ▼
┌──────────────────────────┐
│   ppp_compañias          │
│   (Puerto 3002)          │
│                          │
│ @MessagePattern({        │
│   cmd: 'get_all...'      │
│ })                       │
│ getAllCompanies() {      │
│   return {               │
│     companies: [...]     │
│   }                      │
│ }                        │
└──────────┬───────────────┘
           │ Response
           ▼
       (Regresa al cliente)
```

## 🚀 Cómo Ejecutar

### Opción 1: Manual (3 terminales)
```powershell
# Terminal 1
npm run start:dev ppp_core

# Terminal 2
npm run start:dev ppp_compañias

# Terminal 3
npm run start:dev ppaz-api-gateway
```

### Opción 2: Script Automático
```powershell
.\start-all-services.ps1
```

### Opción 3: Comandos individuales
```powershell
# Desarrollo
npm run start:dev <nombre-app>

# Producción
npm run build
node dist/apps/<nombre-app>/main.js
```

## 🧪 Probar los Servicios

### Usar el script de testing
```powershell
.\test-services.ps1
```

### Manual con PowerShell
```powershell
# Probar companies
Invoke-WebRequest http://localhost:3000/companies | Select-Object -Expand Content

# Probar core
Invoke-WebRequest http://localhost:3000/core/data | Select-Object -Expand Content
```

### Con curl (si lo tienes instalado)
```bash
curl http://localhost:3000/companies
curl http://localhost:3000/core/data
curl http://localhost:3000/companies/1
```

## 📝 Patrones Implementados

### 1. **API Gateway Pattern**
- Un único punto de entrada (puerto 3000)
- Enruta peticiones a múltiples microservicios
- Abstrae la complejidad de los servicios internos

### 2. **Request-Response Pattern**
- Cliente envía comando → Microservicio responde
- Comunicación síncrona mediante TCP
- Uso de `@MessagePattern` para recibir mensajes

### 3. **Service Registry Pattern (Implícito)**
- Gateway conoce las direcciones de los microservicios
- Configuración centralizada en el módulo

## 🔧 Archivos Creados

1. ✅ `MICROSERVICES.md` - Documentación completa
2. ✅ `start-all-services.ps1` - Script para iniciar todos los servicios
3. ✅ `test-services.ps1` - Script para probar los endpoints
4. ✅ `apps/ppaz-api-gateway/src/config/microservices.config.ts` - Configuración centralizada

## 📚 Próximos Pasos Recomendados

1. **Agregar DTOs (Data Transfer Objects)**
   ```typescript
   // create-company.dto.ts
   export class CreateCompanyDto {
     name: string;
     ruc: string;
     address: string;
   }
   ```

2. **Implementar manejo de errores**
   ```typescript
   @Get('companies/:id')
   async getCompany(@Param('id') id: string) {
     return this.companiasClient
       .send({ cmd: 'get_company_by_id' }, parseInt(id))
       .pipe(
         catchError(error => {
           throw new HttpException('Company not found', 404);
         })
       );
   }
   ```

3. **Agregar validación**
   ```bash
   npm install class-validator class-transformer
   ```

4. **Configurar variables de entorno**
   ```bash
   npm install @nestjs/config
   ```

5. **Implementar logging**
   ```bash
   npm install winston nest-winston
   ```

6. **Agregar base de datos**
   ```bash
   npm install @nestjs/typeorm typeorm pg
   ```

## ⚠️ Notas Importantes

- **Orden de inicio**: Siempre inicia los microservicios ANTES del gateway
- **Debugging**: Si hay errores de conexión, verifica que los puertos estén disponibles
- **Hot Reload**: En modo desarrollo (`start:dev`), los cambios se recargan automáticamente
- **Producción**: Siempre compila con `npm run build` antes de desplegar

## 🎯 Estado Actual

✅ ppp_core configurado como microservicio TCP (puerto 3001)
✅ ppp_compañias configurado como microservicio TCP (puerto 3002)
✅ ppaz-api-gateway registra ambos clientes
✅ Endpoints de ejemplo funcionando
✅ Comunicación TCP entre servicios
✅ Scripts de ayuda creados

**¡Tu arquitectura de microservicios está lista para usar!** 🎉
