-- =============================================
-- SCRIPT DE INSERCIÓN DE DATOS DE PRUEBA
-- Base de Datos: ppp_auth (AUTH SERVICE)
-- Fecha: 2025-11-21 (CORREGIDO)
-- =============================================

-- =============================================
-- PASO 1: ROLES (sin campo estado)
-- =============================================
INSERT INTO rol (id, nombre, descripcion, created_at, updated_at) VALUES
('r1111111-1111-1111-1111-111111111111', 'Administrador', 'Usuario con permisos totales', NOW(), NOW()),
('r2222222-2222-2222-2222-222222222222', 'Supervisor', 'Supervisa practicas de alumnos', NOW(), NOW()),
('r3333333-3333-3333-3333-333333333333', 'Alumno', 'Estudiante en practicas', NOW(), NOW()),
('r4444444-4444-4444-4444-444444444444', 'Coordinador', 'Coordinador de practicas', NOW(), NOW()),
('r5555555-5555-5555-5555-555555555555', 'Secretaria', 'Secretaria academica', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 2: USUARIOS (nombres/apellidos, contraseña, activo)
-- =============================================
INSERT INTO usuario (id, email, contraseña, nombres, apellidos, telefono, activo, created_at, updated_at) VALUES
-- Usuarios Supervisores
('u1111111-1111-1111-1111-111111111111', 'supervisor1@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Juan Carlos', 'Perez Garcia', '987654321', true, NOW(), NOW()),
('u2222222-2222-2222-2222-222222222222', 'supervisor2@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Maria Elena', 'Lopez Diaz', '987654322', true, NOW(), NOW()),
('u3333333-3333-3333-3333-333333333333', 'supervisor3@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Carlos Alberto', 'Rodriguez Sanchez', '987654323', true, NOW(), NOW()),
-- Usuarios Alumnos
('u4444444-4444-4444-4444-444444444444', 'alumno1@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Ana Sofia', 'Torres Mendoza', '987654324', true, NOW(), NOW()),
('u5555555-5555-5555-5555-555555555555', 'alumno2@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Luis Fernando', 'Vargas Castro', '987654325', true, NOW(), NOW()),
('u6666666-6666-6666-6666-666666666666', 'alumno3@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Carmen Rosa', 'Flores Rios', '987654326', true, NOW(), NOW()),
('u7777777-7777-7777-7777-777777777777', 'alumno4@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Roberto Miguel', 'Morales Vega', '987654327', true, NOW(), NOW()),
('u8888888-8888-8888-8888-888888888888', 'alumno5@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Patricia Isabel', 'Ramirez Luna', '987654328', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 3: SUPERVISORES (usuario_id, sin especialidad)
-- =============================================
INSERT INTO supervisor (id, usuario_id, id_escuela, created_at, updated_at) VALUES
('d1111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'esc11111-1111-1111-1111-111111111111', NOW(), NOW()),
('d2222222-2222-2222-2222-222222222222', 'u2222222-2222-2222-2222-222222222222', 'esc22222-2222-2222-2222-222222222222', NOW(), NOW()),
('d3333333-3333-3333-3333-333333333333', 'u3333333-3333-3333-3333-333333333333', 'esc33333-3333-3333-3333-333333333333', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 4: ALUMNOS (usuario_id, año es requerido)
-- =============================================
INSERT INTO alumno (id, usuario_id, codigo, id_escuela, ciclo, año, created_at, updated_at) VALUES
('e1111111-1111-1111-1111-111111111111', 'u4444444-4444-4444-4444-444444444444', '2021001234', 'esc11111-1111-1111-1111-111111111111', '9', '2021', NOW(), NOW()),
('e2222222-2222-2222-2222-222222222222', 'u5555555-5555-5555-5555-555555555555', '2021001235', 'esc22222-2222-2222-2222-222222222222', '8', '2021', NOW(), NOW()),
('e3333333-3333-3333-3333-333333333333', 'u6666666-6666-6666-6666-666666666666', '2021001236', 'esc33333-3333-3333-3333-333333333333', '9', '2021', NOW(), NOW()),
('e4444444-4444-4444-4444-444444444444', 'u7777777-7777-7777-7777-777777777777', '2021001237', 'esc44444-4444-4444-4444-444444444444', '9', '2021', NOW(), NOW()),
('e5555555-5555-5555-5555-555555555555', 'u8888888-8888-8888-8888-888888888888', '2021001238', 'esc55555-5555-5555-5555-555555555555', '8', '2021', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- RESUMEN: 5 roles, 8 usuarios, 3 supervisores, 5 alumnos = 21 registros
-- =============================================
