-- =============================================
-- SCRIPT DE INSERCIÓN DE DATOS DE PRUEBA
-- Base de Datos: pnest_core_db (AUTH SERVICE)
-- Fecha: 2025-11-21
-- =============================================
-- Este script inserta datos necesarios para el script de evaluaciones

-- =============================================
-- PASO 1: ROLES (tabla independiente)
-- =============================================
INSERT INTO rol (id, nombre, descripcion, estado, created_at, updated_at) VALUES
('r1111111-1111-1111-1111-111111111111', 'Administrador', 'Usuario con permisos totales', true, NOW(), NOW()),
('r2222222-2222-2222-2222-222222222222', 'Supervisor', 'Supervisa prácticas de alumnos', true, NOW(), NOW()),
('r3333333-3333-3333-3333-333333333333', 'Alumno', 'Estudiante en prácticas', true, NOW(), NOW()),
('r4444444-4444-4444-4444-444444444444', 'Coordinador', 'Coordinador de prácticas', true, NOW(), NOW()),
('r5555555-5555-5555-5555-555555555555', 'Secretaria', 'Secretaria académica', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 2: USUARIOS (depende de roles)
-- =============================================
INSERT INTO usuario (id, email, password, nombre, apellido, estado, id_rol, created_at, updated_at) VALUES
-- Usuarios Supervisores
('u1111111-1111-1111-1111-111111111111', 'supervisor1@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Juan', 'Pérez García', true, 'r2222222-2222-2222-2222-222222222222', NOW(), NOW()),
('u2222222-2222-2222-2222-222222222222', 'supervisor2@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'María', 'López Díaz', true, 'r2222222-2222-2222-2222-222222222222', NOW(), NOW()),
('u3333333-3333-3333-3333-333333333333', 'supervisor3@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Carlos', 'Rodríguez Sánchez', true, 'r2222222-2222-2222-2222-222222222222', NOW(), NOW()),
-- Usuarios Alumnos
('u4444444-4444-4444-4444-444444444444', 'alumno1@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Ana', 'Torres Mendoza', true, 'r3333333-3333-3333-3333-333333333333', NOW(), NOW()),
('u5555555-5555-5555-5555-555555555555', 'alumno2@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Luis', 'Vargas Castro', true, 'r3333333-3333-3333-3333-333333333333', NOW(), NOW()),
('u6666666-6666-6666-6666-666666666666', 'alumno3@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Carmen', 'Flores Ríos', true, 'r3333333-3333-3333-3333-333333333333', NOW(), NOW()),
('u7777777-7777-7777-7777-777777777777', 'alumno4@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Roberto', 'Morales Vega', true, 'r3333333-3333-3333-3333-333333333333', NOW(), NOW()),
('u8888888-8888-8888-8888-888888888888', 'alumno5@upeu.edu.pe', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'Patricia', 'Ramírez Luna', true, 'r3333333-3333-3333-3333-333333333333', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 3: SUPERVISORES (depende de usuarios)
-- =============================================
INSERT INTO supervisor (id, id_usuario, id_escuela, especialidad, estado, created_at, updated_at) VALUES
('d1111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'esc11111-1111-1111-1111-111111111111', 'Ingeniería de Software', true, NOW(), NOW()),
('d2222222-2222-2222-2222-222222222222', 'u2222222-2222-2222-2222-222222222222', 'esc22222-2222-2222-2222-222222222222', 'Ciencia de Datos', true, NOW(), NOW()),
('d3333333-3333-3333-3333-333333333333', 'u3333333-3333-3333-3333-333333333333', 'esc33333-3333-3333-3333-333333333333', 'Redes y Telecomunicaciones', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 4: ALUMNOS (depende de usuarios)
-- =============================================
INSERT INTO alumno (id, id_usuario, codigo, id_escuela, ciclo, estado, created_at, updated_at) VALUES
('e1111111-1111-1111-1111-111111111111', 'u4444444-4444-4444-4444-444444444444', '2021001234', 'esc11111-1111-1111-1111-111111111111', 9, true, NOW(), NOW()),
('e2222222-2222-2222-2222-222222222222', 'u5555555-5555-5555-5555-555555555555', '2021001235', 'esc22222-2222-2222-2222-222222222222', 8, true, NOW(), NOW()),
('e3333333-3333-3333-3333-333333333333', 'u6666666-6666-6666-6666-666666666666', '2021001236', 'esc33333-3333-3333-3333-333333333333', 9, true, NOW(), NOW()),
('e4444444-4444-4444-4444-444444444444', 'u7777777-7777-7777-7777-777777777777', '2021001237', 'esc11111-1111-1111-1111-111111111111', 10, true, NOW(), NOW()),
('e5555555-5555-5555-5555-555555555555', 'u8888888-8888-8888-8888-888888888888', '2021001238', 'esc22222-2222-2222-2222-222222222222', 9, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- RESUMEN DE DATOS INSERTADOS (AUTH DB)
-- =============================================
-- ✅ roles: 5 registros
-- ✅ usuarios: 8 registros (3 supervisores + 5 alumnos)
-- ✅ supervisores: 3 registros
-- ✅ alumnos: 5 registros
-- =============================================
-- TOTAL: 21 registros
-- =============================================

-- NOTA: Los id_escuela (esc11111..., esc22222..., esc33333...) 
-- deben existir en la base de datos CORE (tabla escuelas)
-- Ejecuta primero el script seed-core-database.sql
