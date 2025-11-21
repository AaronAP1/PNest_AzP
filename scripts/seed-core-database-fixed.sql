-- =============================================
-- SCRIPT DE INSERCIÓN DE DATOS DE PRUEBA
-- Base de Datos: ppp_core (CORE SERVICE)
-- Fecha: 2025-11-21 (CORREGIDO)
-- =============================================

-- =============================================
-- PASO 1: FACULTADES
-- =============================================
INSERT INTO facultad (id, nombre, codigo, descripcion, estado, created_at, updated_at) VALUES
('fac11111-1111-1111-1111-111111111111', 'Facultad de Ingenieria y Arquitectura', 'FIA', 'Facultad dedicada a carreras de ingenieria', 'ACTIVO', NOW(), NOW()),
('fac22222-2222-2222-2222-222222222222', 'Facultad de Ciencias Empresariales', 'FCE', 'Facultad de negocios y administracion', 'ACTIVO', NOW(), NOW()),
('fac33333-3333-3333-3333-333333333333', 'Facultad de Ciencias de la Salud', 'FCS', 'Facultad medica y paramedica', 'ACTIVO', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 2: ESCUELAS
-- =============================================
INSERT INTO escuela (id, nombre, codigo, id_facultad, descripcion, estado, created_at, updated_at) VALUES
('esc11111-1111-1111-1111-111111111111', 'Ingenieria de Sistemas', 'IS', 'fac11111-1111-1111-1111-111111111111', 'Escuela Profesional de Ingenieria de Sistemas', 'ACTIVO', NOW(), NOW()),
('esc22222-2222-2222-2222-222222222222', 'Ingenieria Civil', 'IC', 'fac11111-1111-1111-1111-111111111111', 'Escuela Profesional de Ingenieria Civil', 'ACTIVO', NOW(), NOW()),
('esc33333-3333-3333-3333-333333333333', 'Administracion', 'ADM', 'fac22222-2222-2222-2222-222222222222', 'Escuela Profesional de Administracion', 'ACTIVO', NOW(), NOW()),
('esc44444-4444-4444-4444-444444444444', 'Contabilidad', 'CONT', 'fac22222-2222-2222-2222-222222222222', 'Escuela Profesional de Contabilidad', 'ACTIVO', NOW(), NOW()),
('esc55555-5555-5555-5555-555555555555', 'Enfermeria', 'ENF', 'fac33333-3333-3333-3333-333333333333', 'Escuela Profesional de Enfermeria', 'ACTIVO', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 3: LINEAS_FACULTAD (sin descripcion)
-- =============================================
INSERT INTO linea_facultad (id, nombre, codigo, id_escuela, estado, created_at, updated_at) VALUES
-- Lineas para Ingenieria de Sistemas
('j1111111-1111-1111-1111-111111111111', 'Desarrollo de Software', 'DS', 'esc11111-1111-1111-1111-111111111111', 'ACTIVO', NOW(), NOW()),
('j2222222-2222-2222-2222-222222222222', 'Inteligencia Artificial', 'IA', 'esc11111-1111-1111-1111-111111111111', 'ACTIVO', NOW(), NOW()),
('j3333333-3333-3333-3333-333333333333', 'Seguridad Informatica', 'SI', 'esc11111-1111-1111-1111-111111111111', 'ACTIVO', NOW(), NOW()),
-- Lineas para Ingenieria Civil
('j4444444-4444-4444-4444-444444444444', 'Estructuras', 'EST', 'esc22222-2222-2222-2222-222222222222', 'ACTIVO', NOW(), NOW()),
('j5555555-5555-5555-5555-555555555555', 'Geotecnia', 'GEO', 'esc22222-2222-2222-2222-222222222222', 'ACTIVO', NOW(), NOW()),
-- Lineas para Administracion
('j6666666-6666-6666-6666-666666666666', 'Recursos Humanos', 'RH', 'esc33333-3333-3333-3333-333333333333', 'ACTIVO', NOW(), NOW()),
('j7777777-7777-7777-7777-777777777777', 'Marketing Digital', 'MD', 'esc33333-3333-3333-3333-333333333333', 'ACTIVO', NOW(), NOW()),
-- Lineas para Contabilidad
('j8888888-8888-8888-8888-888888888888', 'Auditoria', 'AUD', 'esc44444-4444-4444-4444-444444444444', 'ACTIVO', NOW(), NOW()),
('j9999999-9999-9999-9999-999999999999', 'Tributacion', 'TRIB', 'esc44444-4444-4444-4444-444444444444', 'ACTIVO', NOW(), NOW()),
-- Lineas para Enfermeria
('jaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Enfermeria Clinica', 'EC', 'esc55555-5555-5555-5555-555555555555', 'ACTIVO', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- RESUMEN: 3 facultades, 5 escuelas, 10 lineas = 18 registros
-- =============================================
