# 🗄️ Configuración de Base de Datos con Prisma

## ✅ **Lo que se ha configurado**

### 1. **Tecnologías Instaladas**
- ✅ Prisma ORM
- ✅ @prisma/client
- ✅ class-validator y class-transformer
- ✅ @nestjs/config
- ✅ bcrypt para hasheo de contraseñas
- ✅ @nestjs/mapped-types

### 2. **Base de Datos Configurada**
- 📄 **Schema Prisma**: `prisma/schema.prisma`
- 🗄️ **PostgreSQL** con Docker Compose
- 🔧 **Variables de entorno**: `.env`

### 3. **Entidades Creadas** (según tu diagrama)
- ✅ **Rol** - Roles de usuario
- ✅ **Usuario** - Usuarios del sistema (con relación a rol)
- ✅ **Facultad** - Facultades académicas
- ✅ **Escuela** - Escuelas académicas (relacionada con facultad)
- ✅ **Alumno** - Alumnos (relacionados con usuario y escuela)
- ✅ **Empresa** - Empresas para prácticas
- ✅ **CartaPresentacion** - Cartas de presentación (relaciona alumno y empresa)

### 4. **Módulos Implementados en ppp_core**
```
apps/ppp_core/src/
├── prisma/
│   ├── prisma.service.ts          ✅ Servicio global de Prisma
│   └── prisma.module.ts           ✅ Módulo de Prisma
├── modules/
│   ├── usuarios/
│   │   ├── dto/
│   │   │   ├── create-usuario.dto.ts
│   │   │   ├── update-usuario.dto.ts
│   │   │   └── usuario-response.dto.ts
│   │   ├── usuarios.controller.ts  ✅ Controlador con @MessagePattern
│   │   ├── usuarios.service.ts     ✅ Lógica de negocio
│   │   └── usuarios.module.ts
│   └── roles/
│       ├── dto/
│       │   └── create-rol.dto.ts
│       ├── roles.controller.ts     ✅ Controlador con @MessagePattern
│       ├── roles.service.ts        ✅ Lógica de negocio
│       └── roles.module.ts
```

---

## 🚀 **Paso a Paso para Ejecutar**

### **Paso 1: Levantar PostgreSQL con Docker**

```powershell
# Asegúrate de tener Docker Desktop instalado y corriendo

# Levantar los contenedores
docker-compose up -d

# Verificar que estén corriendo
docker ps
```

Deberías ver:
- `pnest_core_db` - PostgreSQL en puerto 5432
- `pnest_companias_db` - PostgreSQL en puerto 5433
- `pnest_pgadmin` - pgAdmin en puerto 5050

### **Paso 2: Generar el Cliente de Prisma**

```powershell
# Generar el cliente de Prisma basado en el schema
npx prisma generate
```

### **Paso 3: Ejecutar las Migraciones**

```powershell
# Crear la primera migración
npx prisma migrate dev --name init

# Esto creará:
# - Las tablas en la base de datos
# - La carpeta prisma/migrations/
```

### **Paso 4: (Opcional) Poblar Datos Iniciales**

```powershell
# Ver los datos en Prisma Studio (interfaz visual)
npx prisma studio
```

Se abrirá en `http://localhost:5555` donde podrás:
- Ver todas las tablas
- Crear registros manualmente
- Editar y eliminar datos

### **Paso 5: Iniciar el Microservicio**

```powershell
# Iniciar ppp_core
npm run start:dev ppp_core
```

---

## 🧪 **Comandos Prisma Útiles**

```powershell
# Generar cliente de Prisma
npx prisma generate

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Ver estado de migraciones
npx prisma migrate status

# Resetear base de datos (CUIDADO: borra todo)
npx prisma migrate reset

# Abrir Prisma Studio
npx prisma studio

# Formatear el schema.prisma
npx prisma format

# Validar el schema
npx prisma validate
```

---

## 🌐 **Acceso a pgAdmin**

1. Abre el navegador en: `http://localhost:5050`
2. Login:
   - **Email**: `admin@pnest.com`
   - **Password**: `admin`

3. Agregar servidor:
   - **Name**: `PNest Core DB`
   - **Host**: `postgres_core` (nombre del contenedor)
   - **Port**: `5432`
   - **Username**: `postgres`
   - **Password**: `postgres`
   - **Database**: `pnest_core_db`

---

## 📡 **Comandos Disponibles en el Microservicio**

### **Módulo de Roles**
```typescript
// Crear rol
{ cmd: 'create_rol' }
Payload: { nombre: string, descripcion?: string }

// Listar roles
{ cmd: 'find_all_roles' }

// Obtener un rol
{ cmd: 'find_one_rol' }
Payload: string (id)

// Eliminar rol
{ cmd: 'remove_rol' }
Payload: string (id)
```

### **Módulo de Usuarios**
```typescript
// Crear usuario
{ cmd: 'create_usuario' }
Payload: CreateUsuarioDto

// Listar usuarios
{ cmd: 'find_all_usuarios' }

// Obtener un usuario
{ cmd: 'find_one_usuario' }
Payload: string (id)

// Buscar por email
{ cmd: 'find_usuario_by_email' }
Payload: string (email)

// Actualizar usuario
{ cmd: 'update_usuario' }
Payload: { id: string, data: UpdateUsuarioDto }

// Eliminar usuario
{ cmd: 'remove_usuario' }
Payload: string (id)

// Validar contraseña
{ cmd: 'validate_password' }
Payload: { plainPassword: string, hashedPassword: string }
```

---

## 🔄 **Flujo de Trabajo Típico**

### 1. **Crear un Rol**
```typescript
// Desde el API Gateway o directamente al microservicio
{
  cmd: 'create_rol',
  payload: {
    nombre: 'Alumno',
    descripcion: 'Rol para estudiantes'
  }
}
```

### 2. **Crear un Usuario**
```typescript
{
  cmd: 'create_usuario',
  payload: {
    nombres: 'Juan',
    apellidos: 'Pérez',
    email: 'juan@example.com',
    telefono: '987654321',
    contraseña: 'password123',
    activo: true,
    idRol: '<id_del_rol_creado>'
  }
}
```

La contraseña se hasheará automáticamente con bcrypt antes de guardarse.

---

## 🏗️ **Estructura del Proyecto (Opción A)**

```
PNest_AzP/
├── apps/
│   ├── ppp_core/                    ← Microservicio con DB
│   │   └── src/
│   │       ├── modules/             ← Módulos por dominio
│   │       │   ├── usuarios/
│   │       │   ├── roles/
│   │       │   ├── alumnos/        ← Por crear
│   │       │   ├── escuelas/       ← Por crear
│   │       │   └── facultades/     ← Por crear
│   │       ├── prisma/              ← Configuración de Prisma
│   │       └── main.ts
│   │
│   ├── ppp_compañias/               ← Microservicio separado
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── empresas/       ← Por crear
│   │       │   └── cartas/         ← Por crear
│   │       └── prisma/              ← Su propio Prisma
│   │
│   └── ppaz-api-gateway/            ← API Gateway HTTP
│       └── src/
│           ├── modules/
│           │   ├── usuarios/        ← Proxy a ppp_core
│           │   └── empresas/        ← Proxy a ppp_compañias
│           └── main.ts
│
├── prisma/
│   ├── schema.prisma                ✅ Schema de Prisma
│   └── migrations/                  ← Migraciones (auto-generado)
│
├── docker-compose.yml               ✅ PostgreSQL + pgAdmin
├── .env                             ✅ Variables de entorno
└── .env.example                     ✅ Template de .env
```

---

## 🔐 **Seguridad Implementada**

1. ✅ **Contraseñas hasheadas** con bcrypt (salt rounds: 10)
2. ✅ **UsuarioResponseDto** no expone la contraseña
3. ✅ **Validación de datos** con class-validator
4. ✅ **Variables de entorno** para configuración sensible

---

## 📚 **Siguientes Pasos**

### Para completar el sistema:

1. **Crear módulos faltantes en ppp_core:**
   - [ ] Alumnos
   - [ ] Facultades
   - [ ] Escuelas

2. **Crear módulos en ppp_compañias:**
   - [ ] Empresas
   - [ ] Cartas de Presentación

3. **Actualizar API Gateway:**
   - [ ] Endpoints HTTP para usuarios
   - [ ] Endpoints HTTP para roles
   - [ ] Endpoints HTTP para empresas

4. **Implementar Autenticación:**
   - [ ] Módulo de Auth con JWT
   - [ ] Guards de autenticación
   - [ ] Decoradores personalizados

---

## ⚠️ **Notas Importantes**

### **Orden de inicio:**
1. Docker Compose (bases de datos)
2. ppp_core
3. ppp_compañias
4. ppaz-api-gateway

### **Cambios en el schema:**
Si modificas `schema.prisma`:
```powershell
npx prisma generate          # Regenerar cliente
npx prisma migrate dev       # Crear nueva migración
```

### **Bases de datos separadas:**
- `ppp_core` → puerto 5432
- `ppp_compañias` → puerto 5433

Cada microservicio tendrá su **propia base de datos** (principio de microservicios).

---

## 🎯 **¿Quieres continuar?**

Puedo ayudarte con:
1. ✅ Crear los módulos faltantes (Alumnos, Escuelas, Facultades, Empresas)
2. ✅ Configurar el API Gateway con endpoints HTTP
3. ✅ Implementar autenticación JWT
4. ✅ Crear seeders para datos iniciales
5. ✅ Configurar la segunda base de datos para ppp_compañías

**¡Dime qué quieres hacer primero!** 🚀
