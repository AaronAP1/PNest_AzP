# PROBLEMA IDENTIFICADO: Comunicación entre Container Apps

## Diagnóstico

### Error 500 en endpoints
Los endpoints retornan error 500 porque el API Gateway no puede comunicarse con los microservicios.

### Causa raíz
**Azure Container Apps NO soporta comunicación TCP directa entre contenedores.**

Los errores en los logs muestran:
```
Error: connect ECONNREFUSED ::1:3001
```

Esto significa que el Gateway está intentando conectarse por TCP (Transport.TCP) al puerto 3001, pero:
1. Los Container Apps solo pueden comunicarse entre sí mediante **HTTPS** (ingress)
2. El puerto TCP 3001/3002 NO está expuesto para comunicación interna

## Situación Actual

### ✅ LO QUE SÍ FUNCIONA:
- API Gateway accesible públicamente
- Health checks (básicos de memoria/disco)
- Swagger UI
- Conexión a PostgreSQL (después de configurar firewall)

### ❌ LO QUE NO FUNCIONA:
- Comunicación TCP entre API Gateway y microservicios
- Endpoints que intentan proxy a los microservicios
- Health checks que verifican conexión a microservicios

## SOLUCIONES POSIBLES

### SOLUCIÓN 1: Cambiar a HTTP/HTTPS (RECOMENDADA) ⭐
**Ventajas:**
- Mantiene arquitectura de microservicios
- Compatible con Azure Container Apps
- Usa el ingress interno ya configurado

**Cambios necesarios:**
1. Cambiar `Transport.TCP` a `Transport.HTTP` en el Gateway
2. Actualizar configuración de ClientsModule
3. Los microservicios ya exponen HTTPS en puerto 443 (ingress)

**Archivos a modificar:**
- `apps/ppaz-api-gateway/src/ppaz-api-gateway.module.ts`
- Cambiar de:
  ```typescript
  transport: Transport.TCP,
  options: {
    host: configService.get<string>('PPP_CORE_HOST'),
    port: configService.get<number>('PPP_CORE_PORT'),
  }
  ```
  
  A:
  ```typescript
  transport: Transport.HTTP,
  options: {
    url: `https://${configService.get<string>('PPP_CORE_HOST')}`,
  }
  ```

### SOLUCIÓN 2: Monolito Modular
Combinar todo en una sola aplicación (no recomendado para tu caso).

### SOLUCIÓN 3: Azure Kubernetes Service (AKS)
Migrar a AKS que SÍ soporta TCP entre pods (complejo y costoso).

## SOLUCIÓN RECOMENDADA: Cambiar a HTTP

### Paso 1: Modificar los microservicios para exponer HTTP

Los microservicios (ppp_core y ppp_companias) deben cambiar de:
```typescript
// main.ts
const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  PppCoreModule,
  {
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: 3001 },
  },
);
```

A:
```typescript
// main.ts - Modo híbrido (HTTP + Microservice patterns)
const app = await NestFactory.create(PppCoreModule);
// Configurar HTTP server en puerto 3001
await app.listen(3001);
```

### Paso 2: Modificar el Gateway

Cambiar la configuración de ClientsModule para usar HTTP en lugar de TCP.

### Paso 3: Rebuild y redeploy

1. Rebuild las 3 imágenes Docker
2. Push al ACR
3. Restart Container Apps

## ALTERNATIVA TEMPORAL: REST API directa

Mientras implementas los cambios, puedes:
1. Exponer endpoints REST en los microservicios
2. Usar `@nestjs/axios` en el Gateway para hacer HTTP requests
3. No usar el patrón @MessagePattern/@ClientProxy

Esta es la forma más simple y compatible con Container Apps.

## Comandos para ver logs en tiempo real

```bash
# Logs del API Gateway (streaming)
az containerapp logs show --name ppaz-api-gateway --resource-group rg-ppp-microservices --follow

# Logs de ppp_core
az containerapp logs show --name ppp-core-service --resource-group rg-ppp-microservices --follow

# Logs de ppp_companias  
az containerapp logs show --name ppp-companias-service --resource-group rg-ppp-microservices --follow
```

## Estado actual de la infraestructura

✅ **Infrastructure**: Completa y funcional
✅ **Docker Images**: Construidas y en ACR
✅ **Container Apps**: Desplegados y corriendo
✅ **PostgreSQL**: Accesible (firewall configurado)
✅ **Health Checks**: Funcionando (básicos)
✅ **Swagger UI**: Accesible
❌ **Microservices Communication**: Bloqueada por TCP incompatibility

## Próximos pasos

1. **INMEDIATO**: Cambiar arquitectura de TCP a HTTP/REST
2. Rebuild imágenes Docker
3. Redeploy a Container Apps
4. Verificar endpoints funcionando correctamente

¿Quieres que implemente la SOLUCIÓN 1 (cambiar a HTTP)? Es la forma correcta de hacerlo en Azure Container Apps.
