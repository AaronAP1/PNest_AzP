-- =============================================
-- SCRIPT DE INSERCIÓN DE DATOS DE PRUEBA
-- Base de Datos: ppp_auth (AUTH SERVICE)
-- Fecha: 2025-11-21 (CORREGIDO CON UUIDS VALIDOS)
-- =============================================

-- =============================================
-- PASO 1: ROLES
-- =============================================
INSERT INTO rol (id, nombre, descripcion, created_at, updated_at) VALUES
('11111111-cccc-cccc-cccc-111111111111', 'Administrador', 'Usuario con permisos totales', NOW(), NOW()),
('22222222-cccc-cccc-cccc-222222222222', 'Supervisor', 'Supervisa practicas de alumnos', NOW(), NOW()),
('33333333-cccc-cccc-cccc-333333333333', 'Alumno', 'Estudiante en practicas', NOW(), NOW()),
('44444444-cccc-cccc-cccc-444444444444', 'Coordinador', 'Coordinador de practicas', NOW(), NOW()),
('55555555-cccc-cccc-cccc-555555555555', 'Secretaria', 'Secretaria academica', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 2: USUARIOS
-- =============================================
INSERT INTO usuario (id, email, contraseña, nombres, apellidos, telefono, activo, created_at, updated_at) VALUES
('11111111-dddd-dddd-dddd-111111111111', 'supervisor1@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Juan Carlos', 'Perez Garcia', '987654321', true, NOW(), NOW()),
('22222222-dddd-dddd-dddd-222222222222', 'supervisor2@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Maria Elena', 'Lopez Diaz', '987654322', true, NOW(), NOW()),
('33333333-dddd-dddd-dddd-333333333333', 'supervisor3@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Carlos Alberto', 'Rodriguez Sanchez', '987654323', true, NOW(), NOW()),
('44444444-dddd-dddd-dddd-444444444444', 'alumno1@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Ana Sofia', 'Torres Mendoza', '987654324', true, NOW(), NOW()),
('55555555-dddd-dddd-dddd-555555555555', 'alumno2@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Luis Fernando', 'Vargas Castro', '987654325', true, NOW(), NOW()),
('66666666-dddd-dddd-dddd-666666666666', 'alumno3@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Carmen Rosa', 'Flores Rios', '987654326', true, NOW(), NOW()),
('77777777-dddd-dddd-dddd-777777777777', 'alumno4@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Roberto Miguel', 'Morales Vega', '987654327', true, NOW(), NOW()),
('88888888-dddd-dddd-dddd-888888888888', 'alumno5@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Patricia Isabel', 'Ramirez Luna', '987654328', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 3: SUPERVISORES
-- =============================================
INSERT INTO supervisor (id, usuario_id, id_escuela, created_at, updated_at) VALUES
('11111111-eeee-eeee-eeee-111111111111', '11111111-dddd-dddd-dddd-111111111111', '11111111-aaaa-aaaa-aaaa-111111111111', NOW(), NOW()),
('22222222-eeee-eeee-eeee-222222222222', '22222222-dddd-dddd-dddd-222222222222', '22222222-aaaa-aaaa-aaaa-222222222222', NOW(), NOW()),
('33333333-eeee-eeee-eeee-333333333333', '33333333-dddd-dddd-dddd-333333333333', '33333333-aaaa-aaaa-aaaa-333333333333', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 4: ALUMNOS
-- =============================================
INSERT INTO alumno (id, usuario_id, codigo, id_escuela, ciclo, año, created_at, updated_at) VALUES
('11111111-ffff-ffff-ffff-111111111111', '44444444-dddd-dddd-dddd-444444444444', '2021001234', '11111111-aaaa-aaaa-aaaa-111111111111', '9', '2021', NOW(), NOW()),
('22222222-ffff-ffff-ffff-222222222222', '55555555-dddd-dddd-dddd-555555555555', '2021001235', '22222222-aaaa-aaaa-aaaa-222222222222', '8', '2021', NOW(), NOW()),
('33333333-ffff-ffff-ffff-333333333333', '66666666-dddd-dddd-dddd-666666666666', '2021001236', '33333333-aaaa-aaaa-aaaa-333333333333', '9', '2021', NOW(), NOW()),
('44444444-ffff-ffff-ffff-444444444444', '77777777-dddd-dddd-dddd-777777777777', '2021001237', '44444444-aaaa-aaaa-aaaa-444444444444', '9', '2021', NOW(), NOW()),
('55555555-ffff-ffff-ffff-555555555555', '88888888-dddd-dddd-dddd-888888888888', '2021001238', '55555555-aaaa-aaaa-aaaa-555555555555', '8', '2021', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
