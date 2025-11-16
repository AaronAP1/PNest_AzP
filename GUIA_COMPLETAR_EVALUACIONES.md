# 🚀 GUÍA RÁPIDA: Completar Módulos de Evaluaciones

## ✅ COMPLETADOS (2/7)
1. ✅ dimension-transversal
2. ✅ preguntas

## ⏳ EN PROGRESO (1/7)
3. ⏳ evaluacion-supervisor (DTO create iniciado)

## ❌ PENDIENTES (4/7)
4. ❌ evaluacion-pregunta
5. ❌ evaluacion-practicante
6. ❌ evaluacion-practicante-solicitud
7. ❌ pregunta-linea

---

## 📋 TEMPLATE PARA CADA MÓDULO

Cada módulo necesita 5 archivos:
1. `dto/create-{modulo}.dto.ts` - DTO para crear
2. `dto/update-{modulo}.dto.ts` - DTO para actualizar
3. `{modulo}.service.ts` - Lógica de negocio
4. `{modulo}.controller.ts` - Controlador TCP
5. `{modulo}.module.ts` - Módulo NestJS

---

## 🔧 SCHEMAS DE REFERENCIA

### 3. EvaluacionSupervisor
```prisma
model EvaluacionSupervisor {
  id           String   @id @default(uuid()) @db.Uuid
  idSupervisor String   @map("id_supervisor") @db.Uuid
  idAlumno     String   @map("id_alumno") @db.Uuid
  comentario   String?  @db.Text
  estado       Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  preguntas EvaluacionPregunta[]
}
```

**Relaciones:**
- Tiene muchas `evaluacion_preguntas`

---

### 4. EvaluacionPregunta
```prisma
model EvaluacionPregunta {
  id            String   @id @default(uuid()) @db.Uuid
  idEvaluacion  String   @map("id_evaluacion") @db.Uuid
  idPregunta    String   @map("id_pregunta") @db.Uuid
  valor         String   @db.VarChar(255)
  estado        Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  evaluacion EvaluacionSupervisor @relation(fields: [idEvaluacion], references: [id], onDelete: Cascade)
  pregunta   Pregunta              @relation(fields: [idPregunta], references: [id], onDelete: Restrict)
}
```

**Relaciones:**
- Pertenece a `EvaluacionSupervisor`
- Pertenece a `Pregunta`

---

### 5. EvaluacionPracticante
```prisma
model EvaluacionPracticante {
  id          String   @id @default(uuid()) @db.Uuid
  idSolicitud String   @map("id_solicitud") @db.Uuid
  comentario  String?  @db.Text
  estado      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  preguntasLinea                  PreguntaLinea[]
  evaluacionPracticanteSolicitud EvaluacionPracticanteSolicitud[]
}
```

**Relaciones:**
- Tiene muchas `PreguntaLinea`
- Tiene muchas `EvaluacionPracticanteSolicitud`

---

### 6. EvaluacionPracticanteSolicitud
```prisma
model EvaluacionPracticanteSolicitud {
  id                      String   @id @default(uuid()) @db.Uuid
  idDimensionTransversal  String   @map("id_dimension_transversal") @db.Uuid
  idEvaluacionPracticante String   @map("id_evaluacion_practicante") @db.Uuid
  valor                   String   @db.VarChar(255)
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
  
  dimensionTransversal  DimensionTransversal  @relation(fields: [idDimensionTransversal], references: [id], onDelete: Restrict)
  evaluacionPracticante EvaluacionPracticante @relation(fields: [idEvaluacionPracticante], references: [id], onDelete: Cascade)
}
```

**Relaciones:**
- Pertenece a `DimensionTransversal`
- Pertenece a `EvaluacionPracticante`

---

### 7. PreguntaLinea
```prisma
model PreguntaLinea {
  id                       String   @id @default(uuid()) @db.Uuid
  idLineaFacultad          String   @map("id_linea_facultad") @db.Uuid
  idEvaluacionPracticante  String   @map("id_evaluacion_practicante") @db.Uuid
  preguntas                String   @db.Text
  estado                   Boolean  @default(true)
  createdAt                DateTime @default(now())
  updatedAt                DateTime @updatedAt
  
  evaluacionPracticante EvaluacionPracticante @relation(fields: [idEvaluacionPracticante], references: [id], onDelete: Cascade)
}
```

**Relaciones:**
- Pertenece a `EvaluacionPracticante`
- Referencia `idLineaFacultad` (tabla en academic-service)

---

## 📝 MÉTODOS ESTÁNDAR PARA CADA SERVICE

```typescript
async create(createDto)          // Crear nuevo registro
async findAll()                  // Listar todos
async findOne(id)                // Buscar por ID
async update(id, updateDto)      // Actualizar
async remove(id)                 // Eliminar
```

**Métodos adicionales según el módulo:**
- `findByIdSupervisor(id)` - Para EvaluacionSupervisor
- `findByIdAlumno(id)` - Para EvaluacionSupervisor
- `findByIdEvaluacion(id)` - Para EvaluacionPregunta
- `findByIdPregunta(id)` - Para EvaluacionPregunta
- `findByIdSolicitud(id)` - Para EvaluacionPracticante
- `findByIdDimensionTransversal(id)` - Para EvaluacionPracticanteSolicitud
- `findByIdEvaluacionPracticante(id)` - Para PreguntaLinea

---

## 🎯 PRÓXIMOS PASOS

1. **Completar evaluacion-supervisor** (50% hecho)
   - update DTO
   - service completo
   - controller
   - module

2. **Crear evaluacion-pregunta** 
   - DTOs (necesita: idEvaluacion, idPregunta, valor, estado)
   - service con métodos adicionales
   - controller
   - module

3. **Crear evaluacion-practicante**
   - DTOs (necesita: idSolicitud, comentario, estado)
   - service
   - controller
   - module

4. **Crear evaluacion-practicante-solicitud**
   - DTOs (necesita: idDimensionTransversal, idEvaluacionPracticante, valor)
   - service
   - controller
   - module

5. **Crear pregunta-linea**
   - DTOs (necesita: idLineaFacultad, idEvaluacionPracticante, preguntas, estado)
   - service
   - controller
   - module

6. **Registrar todos los módulos en ppp_evaluaciones.module.ts**

7. **Actualizar Gateway** para exponer todos los endpoints

---

## ⚡ COMANDO RÁPIDO PARA VERIFICAR

```powershell
# Verificar que todos los archivos están creados
Get-ChildItem -Path "apps\ppp-evaluaciones-service\src\modules" -Recurse -Filter "*.ts" | Select-Object FullName
```

---

## 📊 PROGRESO EVALUACIONES-SERVICE

```
dimension-transversal:             ████████████████████ 100%
preguntas:                         ████████████████████ 100%
evaluacion-supervisor:             ██████░░░░░░░░░░░░░░  30%
evaluacion-pregunta:               ░░░░░░░░░░░░░░░░░░░░   0%
evaluacion-practicante:            ░░░░░░░░░░░░░░░░░░░░   0%
evaluacion-practicante-solicitud:  ░░░░░░░░░░░░░░░░░░░░   0%
pregunta-linea:                    ░░░░░░░░░░░░░░░░░░░░   0%
──────────────────────────────────────────────────────────
TOTAL EVALUACIONES:                ████████░░░░░░░░░░░░  33%
```
