# 🌐 API Gateway - Endpoints HTTP

## ✅ **Servicios Configurados**

- **API Gateway**: `http://localhost:3000`
- **ppp_core**: `localhost:3001` (TCP)

---

## 📋 **ENDPOINTS DE ROLES**

### **1. Crear Rol**
```http
POST http://localhost:3000/roles
Content-Type: application/json

{
  "nombre": "Alumno",
  "descripcion": "Rol para estudiantes de la universidad"
}
```

**PowerShell:**
```powershell
$body = @{
    nombre = "Alumno"
    descripcion = "Rol para estudiantes de la universidad"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/roles" -Method Post -Body $body -ContentType "application/json"
```

---

### **2. Listar Todos los Roles**
```http
GET http://localhost:3000/roles
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/roles" -Method Get
```

---

### **3. Obtener Rol por ID**
```http
GET http://localhost:3000/roles/{id}
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/roles/UUID_AQUI" -Method Get
```

---

### **4. Eliminar Rol**
```http
DELETE http://localhost:3000/roles/{id}
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/roles/UUID_AQUI" -Method Delete
```

---

## 👤 **ENDPOINTS DE USUARIOS**

### **1. Crear Usuario**
```http
POST http://localhost:3000/usuarios
Content-Type: application/json

{
  "nombres": "Juan",
  "apellidos": "Pérez García",
  "email": "juan.perez@upeu.edu.pe",
  "telefono": "987654321",
  "contraseña": "password123",
  "activo": true,
  "idRol": "UUID_DEL_ROL"
}
```

**PowerShell:**
```powershell
$body = @{
    nombres = "Juan"
    apellidos = "Pérez García"
    email = "juan.perez@upeu.edu.pe"
    telefono = "987654321"
    contraseña = "password123"
    activo = $true
    idRol = "UUID_DEL_ROL_AQUI"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/usuarios" -Method Post -Body $body -ContentType "application/json"
```

---

### **2. Listar Todos los Usuarios**
```http
GET http://localhost:3000/usuarios
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/usuarios" -Method Get | ConvertTo-Json -Depth 5
```

---

### **3. Obtener Usuario por ID**
```http
GET http://localhost:3000/usuarios/{id}
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/usuarios/UUID_AQUI" -Method Get | ConvertTo-Json -Depth 5
```

---

### **4. Buscar Usuario por Email**
```http
GET http://localhost:3000/usuarios/email/{email}
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/usuarios/email/juan.perez@upeu.edu.pe" -Method Get
```

---

### **5. Actualizar Usuario**
```http
PATCH http://localhost:3000/usuarios/{id}
Content-Type: application/json

{
  "nombres": "Juan Carlos",
  "telefono": "999888777"
}
```

**PowerShell:**
```powershell
$body = @{
    nombres = "Juan Carlos"
    telefono = "999888777"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/usuarios/UUID_AQUI" -Method Patch -Body $body -ContentType "application/json"
```

---

### **6. Eliminar Usuario**
```http
DELETE http://localhost:3000/usuarios/{id}
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/usuarios/UUID_AQUI" -Method Delete
```

---

## 🧪 **FLUJO DE PRUEBA COMPLETO**

### **Paso 1: Crear un Rol**
```powershell
$rol = @{
    nombre = "Alumno"
    descripcion = "Estudiante de la universidad"
} | ConvertTo-Json

$rolCreado = Invoke-RestMethod -Uri "http://localhost:3000/roles" -Method Post -Body $rol -ContentType "application/json"

Write-Host "✅ Rol creado con ID: $($rolCreado.id)" -ForegroundColor Green
$rolId = $rolCreado.id
```

### **Paso 2: Crear un Usuario**
```powershell
$usuario = @{
    nombres = "María"
    apellidos = "González López"
    email = "maria.gonzalez@upeu.edu.pe"
    telefono = "987654321"
    contraseña = "securePassword123"
    activo = $true
    idRol = $rolId
} | ConvertTo-Json

$usuarioCreado = Invoke-RestMethod -Uri "http://localhost:3000/usuarios" -Method Post -Body $usuario -ContentType "application/json"

Write-Host "✅ Usuario creado con ID: $($usuarioCreado.id)" -ForegroundColor Green
$usuarioId = $usuarioCreado.id
```

### **Paso 3: Listar Todos los Usuarios**
```powershell
$usuarios = Invoke-RestMethod -Uri "http://localhost:3000/usuarios" -Method Get
$usuarios | ConvertTo-Json -Depth 5
```

### **Paso 4: Buscar Usuario por Email**
```powershell
$usuario = Invoke-RestMethod -Uri "http://localhost:3000/usuarios/email/maria.gonzalez@upeu.edu.pe" -Method Get
$usuario | ConvertTo-Json -Depth 5
```

### **Paso 5: Actualizar Usuario**
```powershell
$update = @{
    telefono = "999111222"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/usuarios/$usuarioId" -Method Patch -Body $update -ContentType "application/json"
```

---

## 🔍 **VERIFICACIÓN EN PRISMA STUDIO**

```powershell
# Abrir Prisma Studio para ver los datos en Azure
npx prisma studio
```

Se abrirá en `http://localhost:5555` conectado a tu base de datos Azure.

---

## ⚡ **ORDEN DE INICIO**

```powershell
# Terminal 1: Microservicio Core
npm run start:dev ppp_core

# Terminal 2: API Gateway
npm run start:dev ppaz-api-gateway

# Terminal 3: Probar endpoints
# Ejecuta los comandos de arriba
```

---

## 📊 **RESUMEN DE RUTAS**

| Método | Ruta | Descripción |
|--------|------|-------------|
| **ROLES** |
| POST | `/roles` | Crear rol |
| GET | `/roles` | Listar roles |
| GET | `/roles/:id` | Obtener rol |
| DELETE | `/roles/:id` | Eliminar rol |
| **USUARIOS** |
| POST | `/usuarios` | Crear usuario |
| GET | `/usuarios` | Listar usuarios |
| GET | `/usuarios/:id` | Obtener usuario |
| GET | `/usuarios/email/:email` | Buscar por email |
| PATCH | `/usuarios/:id` | Actualizar usuario |
| DELETE | `/usuarios/:id` | Eliminar usuario |

---

## ✅ **VALIDACIONES AUTOMÁTICAS**

El API Gateway valida automáticamente:
- ✅ Email válido
- ✅ Campos requeridos
- ✅ Longitud de strings
- ✅ Tipos de datos
- ✅ Campos no permitidos (rechaza campos extra)

**Ejemplo de error de validación:**
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "contraseña must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

---

## 🎉 **¡Todo Listo!**

Tu API Gateway está configurado y listo para recibir peticiones HTTP que se comunicarán con el microservicio `ppp_core` vía TCP.

**Contraseñas se hashean automáticamente con bcrypt antes de guardarse en Azure PostgreSQL.** 🔐
