# 🌐 Configuración de Azure PostgreSQL para PNest

## ✅ **Estado Actual**

### **Recursos Azure Disponibles**
- ✅ PostgreSQL Server: `psql-upeu-ppp-5628.postgres.database.azure.com`
- ✅ Redis Cache: `redis-upeu-ppp-1147.redis.cache.windows.net`
- ✅ Cosmos DB (MongoDB): `cosmos-upeu-ppp-2725`
- ✅ Resource Group: `rg-upeu-ppp-students`
- ✅ Location: `brazilsouth`

### **Bases de Datos**
- ✅ `upeu_ppp_system` - Base de datos principal (ya existe)
- 🆕 `pppNest` - Nueva BD para microservicios NestJS (por crear)

---

## 🚀 **Pasos para Configurar**

### **Opción 1: Crear BD con Azure Portal (Recomendado)**

1. **Accede a Azure Portal**: https://portal.azure.com
2. Busca tu servidor PostgreSQL: `psql-upeu-ppp-5628`
3. En el menú lateral, selecciona **"Databases"**
4. Click en **"+ Add"**
5. Nombre de la base de datos: `pppNest`
6. Click en **"Save"**

✅ ¡Listo! La base de datos está creada.

---

### **Opción 2: Crear BD con Azure CLI**

```bash
# Login a Azure
az login

# Crear la base de datos
az postgres db create \
  --resource-group rg-upeu-ppp-students \
  --server-name psql-upeu-ppp-5628 \
  --name pppNest

# Verificar
az postgres db list \
  --resource-group rg-upeu-ppp-students \
  --server-name psql-upeu-ppp-5628 \
  --output table
```

---

### **Opción 3: Usar psql (si tienes instalado)**

```powershell
# Ejecutar el script de PowerShell
.\scripts\create-azure-db.ps1
```

O manualmente:

```powershell
# Conectar a PostgreSQL Azure
psql -h psql-upeu-ppp-5628.postgres.database.azure.com -p 5432 -U upeuadmin -d postgres

# Luego ejecutar:
CREATE DATABASE "pppNest" WITH OWNER = upeuadmin ENCODING = 'UTF8';
\q
```

---

## 📊 **Ejecutar Migraciones de Prisma**

Una vez creada la base de datos `pppNest`:

### **1. Verificar conexión**

```powershell
# Validar el schema
npx prisma validate

# Formatear el schema
npx prisma format
```

### **2. Generar el cliente de Prisma**

```powershell
npx prisma generate
```

### **3. Crear la migración inicial**

```powershell
# Esto creará todas las tablas en Azure PostgreSQL
npx prisma migrate dev --name init
```

**⚠️ Importante**: 
- La primera vez te preguntará si quieres resetear la BD (di que sí)
- Todas las tablas se crearán automáticamente
- Las relaciones y constraints se configurarán

### **4. (Opcional) Ver datos con Prisma Studio**

```powershell
npx prisma studio
```

Se abrirá en `http://localhost:5555` conectado a Azure.

---

## 🗄️ **Tablas que se Crearán**

| Tabla | Descripción |
|-------|-------------|
| `rol` | Roles del sistema |
| `usuario` | Usuarios con autenticación |
| `usuario_rol` | Relación many-to-many usuario-rol |
| `facultad` | Facultades académicas |
| `escuela` | Escuelas por facultad |
| `alumno` | Alumnos del sistema |
| `empresa` | Empresas para prácticas |
| `carta_presentacion` | Cartas de presentación |

---

## 🔐 **Configuración de Firewall Azure**

Si tienes problemas de conexión, verifica el firewall:

### **Opción 1: Azure Portal**

1. Ve a tu servidor PostgreSQL en Azure Portal
2. En **"Settings"** → **"Connection security"**
3. Agrega tu IP actual o habilita **"Allow Azure services"**
4. Guarda los cambios

### **Opción 2: Azure CLI**

```bash
# Agregar tu IP actual
az postgres server firewall-rule create \
  --resource-group rg-upeu-ppp-students \
  --server psql-upeu-ppp-5628 \
  --name AllowMyIP \
  --start-ip-address TU_IP \
  --end-ip-address TU_IP

# Permitir todos los servicios de Azure
az postgres server firewall-rule create \
  --resource-group rg-upeu-ppp-students \
  --server psql-upeu-ppp-5628 \
  --name AllowAllAzureIPs \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

---

## 🧪 **Probar la Conexión**

### **Con Node.js (test rápido)**

Crea `test-connection.js`:

```javascript
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('🔍 Probando conexión a Azure PostgreSQL...');
  
  try {
    await prisma.$connect();
    console.log('✅ Conexión exitosa!');
    
    // Probar una query simple
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('📊 Versión de PostgreSQL:', result);
    
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

Ejecutar:

```powershell
node test-connection.js
```

---

## 📋 **Checklist de Configuración**

- [ ] ✅ Variables de entorno configuradas en `.env`
- [ ] ✅ Base de datos `pppNest` creada en Azure
- [ ] ✅ Firewall de Azure permite tu IP
- [ ] ✅ `npx prisma generate` ejecutado
- [ ] ✅ `npx prisma migrate dev --name init` ejecutado
- [ ] ✅ Tablas creadas en Azure PostgreSQL
- [ ] ✅ Prisma Studio funciona correctamente

---

## 🔧 **Comandos Útiles**

```powershell
# Ver estado de migraciones
npx prisma migrate status

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Resetear base de datos (CUIDADO)
npx prisma migrate reset

# Ver datos
npx prisma studio

# Validar schema
npx prisma validate

# Formatear schema
npx prisma format
```

---

## 🌐 **Variables de Entorno Configuradas**

```env
# PostgreSQL Azure
DATABASE_URL="postgresql://upeuadmin:***@psql-upeu-ppp-5628.postgres.database.azure.com:5432/pppNest?schema=public&sslmode=require"

# Redis Azure
REDIS_URL="rediss://:***@redis-upeu-ppp-1147.redis.cache.windows.net:6380/0"

# Cosmos DB (MongoDB)
MONGODB_URI="mongodb://***@cosmos-upeu-ppp-2725.mongo.cosmos.azure.com:10255/?ssl=true"
```

---

## ⚠️ **Notas Importantes**

### **SSL Requerido**
Azure PostgreSQL **requiere SSL**. La URL de conexión debe incluir:
```
?sslmode=require
```

### **Límites de Conexión**
- Azure PostgreSQL tiene límites de conexiones concurrentes
- Prisma maneja esto automáticamente con connection pooling

### **Backups**
- Azure PostgreSQL hace backups automáticos
- Puedes restaurar desde Azure Portal

### **Performance**
- Las primeras conexiones pueden ser lentas
- Considera usar connection pooling en producción

---

## 🚀 **Iniciar el Microservicio**

Una vez configurado todo:

```powershell
# Iniciar ppp_core conectado a Azure
npm run start:dev ppp_core

# Deberías ver:
# ✅ Prisma connected to database
# 🚀 Microservice is listening on port 3001
```

---

## 📞 **Soporte**

Si tienes problemas:

1. **Verifica el firewall** de Azure
2. **Revisa las credenciales** en `.env`
3. **Comprueba que `sslmode=require`** esté en la URL
4. **Mira los logs** de Prisma

**¡Tu BD en Azure está lista para usar!** 🎉
