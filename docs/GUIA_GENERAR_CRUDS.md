# ==============================================================================
# Guía: Generar Módulos CRUD con NestJS CLI
# ==============================================================================

## 🎯 Objetivo
Esta guía te ayudará a generar los módulos CRUD restantes para completar todos los microservicios.

---

## 📋 Módulos ya creados (ejemplos completos)

### ✅ ppp-auth-service
- [x] usuarios (CRUD completo con hash de contraseña)
- [x] roles (CRUD completo con validaciones)

### ✅ ppp_core (academic-service)
- [x] facultades
- [x] escuelas
- [x] alumnos
- [x] secretarias
- [x] supervisores (CRUD completo creado)
- [x] coordinadores (CRUD completo creado)
- [x] lineas-facultad (CRUD completo creado)

### ⚠️ ppp_compañias (core-service) - Necesita actualizarse
- [ ] empresas (actualizar)
- [ ] solicitudes-ppp (crear nuevo)
- [ ] cartas-presentacion (actualizar)
- [ ] reuniones (crear nuevo)
- [ ] tipo-documentos (ya existe)
- [ ] documentos (ya existe)

### ❌ ppp-evaluaciones-service - Todos por crear
- [ ] evaluacion-supervisor
- [ ] evaluacion-preguntas
- [ ] preguntas
- [ ] evaluacion-practicante
- [ ] evaluacion-practicante-solicitud
- [ ] preguntas-linea
- [ ] dimension-transversal

---

## 🚀 OPCIÓN 1: Generar módulos con NestJS CLI

### Para ppp_compañias (core-service):

```powershell
# Navegar al directorio del proyecto
cd c:\Users\xdxdxdxd\OneDrive - Universidad Peruana Unión\Escritorio\PNest_AzP

# Generar módulo de Solicitudes PPP
nest g module modules/solicitudes-ppp apps/ppp_compañias/src
nest g service modules/solicitudes-ppp apps/ppp_compañias/src --no-spec
nest g controller modules/solicitudes-ppp apps/ppp_compañias/src --no-spec

# Generar módulo de Reuniones
nest g module modules/reuniones apps/ppp_compañias/src
nest g service modules/reuniones apps/ppp_compañias/src --no-spec
nest g controller modules/reuniones apps/ppp_compañias/src --no-spec
```

### Para ppp-evaluaciones-service:

```powershell
# Generar módulo de Evaluación Supervisor
nest g module modules/evaluacion-supervisor apps/ppp-evaluaciones-service/src
nest g service modules/evaluacion-supervisor apps/ppp-evaluaciones-service/src --no-spec
nest g controller modules/evaluacion-supervisor apps/ppp-evaluaciones-service/src --no-spec

# Generar módulo de Preguntas
nest g module modules/preguntas apps/ppp-evaluaciones-service/src
nest g service modules/preguntas apps/ppp-evaluaciones-service/src --no-spec
nest g controller modules/preguntas apps/ppp-evaluaciones-service/src --no-spec

# Generar módulo de Evaluación Practicante
nest g module modules/evaluacion-practicante apps/ppp-evaluaciones-service/src
nest g service modules/evaluacion-practicante apps/ppp-evaluaciones-service/src --no-spec
nest g controller modules/evaluacion-practicante apps/ppp-evaluaciones-service/src --no-spec

# Generar módulo de Dimensión Transversal
nest g module modules/dimension-transversal apps/ppp-evaluaciones-service/src
nest g service modules/dimension-transversal apps/ppp-evaluaciones-service/src --no-spec
nest g controller modules/dimension-transversal apps/ppp-evaluaciones-service/src --no-spec
```

---

## 🔧 OPCIÓN 2: Plantilla CRUD Base

### Estructura de archivos para cada módulo:

```
modules/
  └── nombre-modulo/
      ├── dto/
      │   ├── create-nombre.dto.ts
      │   └── update-nombre.dto.ts
      ├── nombre.controller.ts
      ├── nombre.service.ts
      └── nombre.module.ts
```

### Plantilla de DTO (create-*.dto.ts):

```typescript
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateNombreDto {
  @IsString()
  campo1: string;

  @IsUUID()
  campo2: string;

  @IsOptional()
  @IsString()
  campo3?: string;
}
```

### Plantilla de Service (*.service.ts):

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNombreDto } from './dto/create-nombre.dto';
import { UpdateNombreDto } from './dto/update-nombre.dto';

@Injectable()
export class NombreService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateNombreDto) {
    return this.prisma.nombreTabla.create({
      data: createDto,
    });
  }

  async findAll() {
    return this.prisma.nombreTabla.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.nombreTabla.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Item con ID ${id} no encontrado`);
    }

    return item;
  }

  async update(id: string, updateDto: UpdateNombreDto) {
    await this.findOne(id);
    
    return this.prisma.nombreTabla.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    
    await this.prisma.nombreTabla.delete({
      where: { id },
    });

    return { message: 'Item eliminado correctamente' };
  }
}
```

### Plantilla de Controller (*.controller.ts):

```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NombreService } from './nombre.service';
import { CreateNombreDto } from './dto/create-nombre.dto';
import { UpdateNombreDto } from './dto/update-nombre.dto';

@Controller()
export class NombreController {
  constructor(private readonly service: NombreService) {}

  @MessagePattern('nombre.create')
  create(@Payload() createDto: CreateNombreDto) {
    return this.service.create(createDto);
  }

  @MessagePattern('nombre.findAll')
  findAll() {
    return this.service.findAll();
  }

  @MessagePattern('nombre.findOne')
  findOne(@Payload() id: string) {
    return this.service.findOne(id);
  }

  @MessagePattern('nombre.update')
  update(@Payload() payload: { id: string; updateDto: UpdateNombreDto }) {
    return this.service.update(payload.id, payload.updateDto);
  }

  @MessagePattern('nombre.remove')
  remove(@Payload() id: string) {
    return this.service.remove(id);
  }
}
```

---

## 📝 Checklist de tareas

### ppp_compañias (core-service):
- [ ] Actualizar módulo empresas para nuevo schema
- [ ] Crear módulo solicitudes-ppp
- [ ] Actualizar módulo cartas-presentacion
- [ ] Crear módulo reuniones
- [ ] Verificar tipo-documentos y documentos

### ppp-evaluaciones-service:
- [ ] Crear módulo evaluacion-supervisor
- [ ] Crear módulo evaluacion-preguntas  
- [ ] Crear módulo preguntas
- [ ] Crear módulo evaluacion-practicante
- [ ] Crear módulo evaluacion-practicante-solicitud
- [ ] Crear módulo preguntas-linea
- [ ] Crear módulo dimension-transversal

---

## 💡 Tips

1. **Copia y adapta**: Usa los módulos existentes (supervisores, coordinadores, lineas-facultad) como referencia
2. **Prisma Client**: Después de modificar schemas, ejecuta `npx prisma generate --schema=./ruta/al/schema.prisma`
3. **Validaciones**: Usa class-validator en los DTOs para validar datos
4. **Relaciones**: Usa `include` en Prisma para traer datos relacionados
5. **Índices**: Los `@@index` en el schema mejoran el rendimiento de consultas

---

## 🎓 Ejemplo completo: Crear módulo "Dimension Transversal"

```powershell
# 1. Generar estructura
nest g module modules/dimension-transversal apps/ppp-evaluaciones-service/src
nest g service modules/dimension-transversal apps/ppp-evaluaciones-service/src --no-spec
nest g controller modules/dimension-transversal apps/ppp-evaluaciones-service/src --no-spec

# 2. Crear carpeta dto manualmente
mkdir apps/ppp-evaluaciones-service/src/modules/dimension-transversal/dto

# 3. Crear create-dimension-transversal.dto.ts
# (copiar contenido de la plantilla y adaptar)

# 4. Crear update-dimension-transversal.dto.ts
# (usar PartialType del create)

# 5. Implementar service con lógica CRUD
# (seguir plantilla)

# 6. Implementar controller con MessagePatterns
# (seguir plantilla)

# 7. Registrar en el módulo principal
# (agregar a imports en ppp-evaluaciones-service.module.ts)
```

---

## 🚦 Próximos pasos después de crear CRUDs

1. Generar migraciones de Prisma para cada servicio
2. Aplicar migraciones en Azure
3. Probar endpoints desde el Gateway
4. Documentar APIs en Swagger
5. Crear tests unitarios e integración
