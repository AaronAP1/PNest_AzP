# 📊 Actualización de Schemas - Bases de Datos Separadas

## ✅ Cambios Aplicados

### 🎓 **pppNest_Core** (Microservicio Académico)

#### Nuevas Tablas:
- ✅ **secretaria**
  - `id` → UUID
  - `nombre` → VARCHAR(255)
  - `id_escuela` → UUID (FK a escuela)
  - `created_at`, `updated_at` → TIMESTAMP

#### Tipos de Datos Optimizados:
| Tabla | Campo | Antes | Ahora | Razón |
|-------|-------|-------|-------|-------|
| **rol** | `descripcion` | VARCHAR(255) | TEXT | Descripciones largas |
| **rol** | `nombre` | VARCHAR(255) | VARCHAR(100) | Nombres cortos |
| **facultad** | `codigo` | VARCHAR(255) | VARCHAR(50) | Códigos cortos |
| **facultad** | `descripcion` | VARCHAR(255) | TEXT | Descripciones largas |
| **escuela** | `codigo` | VARCHAR(255) | VARCHAR(50) | Códigos cortos |
| **escuela** | `descripcion` | VARCHAR(255) | TEXT | Descripciones largas |
| **alumno** | `ciclo` | VARCHAR(20) | VARCHAR(10) | Ej: "X" |
| **alumno** | `año` | VARCHAR(20) | VARCHAR(4) | Ej: "2024" |

#### Relaciones Académicas:
```
Facultad (1) ──→ (N) Escuela
    ↓
Escuela (1) ──→ (N) Alumno
    ↓
Escuela (1) ──→ (N) Secretaria
```

---

### 🏢 **pppNest_Companias** (Microservicio Empresarial)

#### Nuevas Tablas:

**1. tipo_documento**
- `id` → UUID
- `nombre` → VARCHAR(100) - Ej: "Carta de Presentación", "Convenio", "Informe"
- `descripcion` → TEXT
- `created_at`, `updated_at` → TIMESTAMP

**2. documento**
- `id` → UUID
- `id_tipo_documento` → UUID (FK a tipo_documento)
- `nombre_archivo` → VARCHAR(255)
- `ruta_archivo` → TEXT (almacena URL o path)
- `subido_por` → UUID (referencia a usuario en ppp_core, NO FK)
- `generado_por` → UUID (referencia a usuario en ppp_core, NO FK)
- `created_at`, `updated_at` → TIMESTAMP

#### Cambios en carta_presentacion:

**Campos Actualizados:**
| Campo | Antes | Ahora | Comentario |
|-------|-------|-------|------------|
| `id_alumno` | UUID | **ELIMINADO** | Ahora es `id_usuario` |
| - | - | `id_usuario` → UUID | Referencia a usuario (ppp_core) |
| `secretaria_id` | UUID | `id_secretaria` → UUID | Referencia a secretaria (ppp_core) |
| - | - | `documento_id` → UUID | FK a documento (local) |
| `motivo_rechazo` | VARCHAR(255) | TEXT | Textos largos |
| `submitted_at` | TIMESTAMP | TIMESTAMPTZ(6) | Con zona horaria |
| `reviewed_at` | TIMESTAMP | TIMESTAMPTZ(6) | Con zona horaria |
| `estado` | CartaEstado | CartaEstado @default(draft) | Valor por defecto |

**Tipos de Datos Optimizados en empresa:**
| Campo | Antes | Ahora | Razón |
|-------|-------|-------|-------|
| `ruc` | VARCHAR(11) | CHAR(11) | Longitud fija (RUC siempre 11 dígitos) |
| `sector` | VARCHAR(120) | VARCHAR(100) | Optimización |
| `grado_academico` | VARCHAR(120) | VARCHAR(100) | Optimización |
| `cargo_representante` | VARCHAR(120) | VARCHAR(100) | Optimización |
| `telefono` | VARCHAR(20) | VARCHAR(15) | Teléfonos estándar |
| `area_practica` | VARCHAR(120) | VARCHAR(100) | Optimización |
| `direccion` | VARCHAR(255) | TEXT | Direcciones largas |

#### Relaciones en ppp_compañias:
```
TipoDocumento (1) ──→ (N) Documento
                              ↓
CartaPresentacion ────────────┘ (N:1)
    ↓
Empresa (1) ──→ (N) CartaPresentacion
```

---

## 🔗 Comunicación Entre Microservicios

### Desde ppp_compañias → ppp_core (vía TCP):

**Validaciones necesarias:**
1. Cuando se crea una **CartaPresentacion**:
   - Validar que `id_usuario` existe en tabla `usuario` (ppp_core)
   - Validar que `id_secretaria` existe en tabla `secretaria` (ppp_core)

2. Cuando se crea un **Documento**:
   - Validar `subido_por` existe en `usuario` (ppp_core)
   - Validar `generado_por` existe en `usuario` (ppp_core)

**Ejemplo de validación en CartasService:**
```typescript
async createCarta(dto: CreateCartaDto) {
  // 1. Validar usuario existe en ppp_core
  const usuario = await this.coreClient.send(
    { cmd: 'find_one_usuario' },
    dto.idUsuario
  ).toPromise();
  
  if (!usuario) {
    throw new NotFoundException('Usuario no encontrado');
  }

  // 2. Validar secretaria existe en ppp_core (si se proporciona)
  if (dto.idSecretaria) {
    const secretaria = await this.coreClient.send(
      { cmd: 'find_one_secretaria' },
      dto.idSecretaria
    ).toPromise();
    
    if (!secretaria) {
      throw new NotFoundException('Secretaria no encontrada');
    }
  }

  // 3. Crear la carta
  return this.prisma.cartaPresentacion.create({ data: dto });
}
```

---

## 📈 Ventajas de los Tipos de Datos Optimizados

| Optimización | Beneficio |
|--------------|-----------|
| VARCHAR → TEXT | Permite descripciones ilimitadas |
| VARCHAR(255) → VARCHAR(50) | Ahorro de espacio en índices |
| VARCHAR → CHAR | Mejor performance para longitud fija (RUC) |
| TIMESTAMP → TIMESTAMPTZ | Manejo correcto de zonas horarias |
| Valores @default | Menor código en servicios |

---

## 🚀 Próximos Pasos

1. Implementar módulos en **ppp_core**:
   - ❌ SecretariasModule
   - ❌ FacultadesModule
   - ❌ EscuelasModule
   - ❌ AlumnosModule

2. Implementar módulos en **ppp_compañias**:
   - ❌ TipoDocumentosModule
   - ❌ DocumentosModule
   - ❌ EmpresasModule
   - ❌ CartasPresentacionModule

3. Configurar validaciones TCP entre microservicios
