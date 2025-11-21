-- =============================================
-- SCRIPT DE INSERCIÓN DE DATOS DE PRUEBA
-- Base de Datos: pnest_core_db (CORE SERVICE)
-- Fecha: 2025-11-21
-- =============================================
-- Este script inserta datos académicos necesarios para otros servicios

-- =============================================
-- PASO 1: FACULTADES (tabla independiente)
-- =============================================
INSERT INTO facultad (id, nombre, descripcion, estado, created_at, updated_at) VALUES
('fac11111-1111-1111-1111-111111111111', 'Facultad de Ingeniería y Arquitectura', 'Facultad dedicada a carreras de ingeniería', true, NOW(), NOW()),
('fac22222-2222-2222-2222-222222222222', 'Facultad de Ciencias Empresariales', 'Facultad de negocios y administración', true, NOW(), NOW()),
('fac33333-3333-3333-3333-333333333333', 'Facultad de Ciencias de la Salud', 'Facultad médica y paramédica', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 2: ESCUELAS (depende de facultades)
-- =============================================
INSERT INTO escuela (id, nombre, id_facultad, descripcion, estado, created_at, updated_at) VALUES
('esc11111-1111-1111-1111-111111111111', 'Ingeniería de Sistemas', 'fac11111-1111-1111-1111-111111111111', 'Escuela Profesional de Ingeniería de Sistemas', true, NOW(), NOW()),
('esc22222-2222-2222-2222-222222222222', 'Ingeniería Civil', 'fac11111-1111-1111-1111-111111111111', 'Escuela Profesional de Ingeniería Civil', true, NOW(), NOW()),
('esc33333-3333-3333-3333-333333333333', 'Administración', 'fac22222-2222-2222-2222-222222222222', 'Escuela Profesional de Administración', true, NOW(), NOW()),
('esc44444-4444-4444-4444-444444444444', 'Contabilidad', 'fac22222-2222-2222-2222-222222222222', 'Escuela Profesional de Contabilidad', true, NOW(), NOW()),
('esc55555-5555-5555-5555-555555555555', 'Enfermería', 'fac33333-3333-3333-3333-333333333333', 'Escuela Profesional de Enfermería', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 3: LINEAS_FACULTAD (depende de escuelas)
-- =============================================
INSERT INTO linea_facultad (id, nombre, id_escuela, descripcion, estado, created_at, updated_at) VALUES
-- Líneas para Ingeniería de Sistemas
('j1111111-1111-1111-1111-111111111111', 'Desarrollo de Software', 'esc11111-1111-1111-1111-111111111111', 'Línea especializada en desarrollo de aplicaciones', true, NOW(), NOW()),
('j2222222-2222-2222-2222-222222222222', 'Inteligencia Artificial', 'esc11111-1111-1111-1111-111111111111', 'Línea de IA y Machine Learning', true, NOW(), NOW()),
('j3333333-3333-3333-3333-333333333333', 'Seguridad Informática', 'esc11111-1111-1111-1111-111111111111', 'Línea de ciberseguridad y ethical hacking', true, NOW(), NOW()),
-- Líneas para Ingeniería Civil
('j4444444-4444-4444-4444-444444444444', 'Estructuras', 'esc22222-2222-2222-2222-222222222222', 'Línea de diseño estructural', true, NOW(), NOW()),
('j5555555-5555-5555-5555-555555555555', 'Geotecnia', 'esc22222-2222-2222-2222-222222222222', 'Línea de mecánica de suelos', true, NOW(), NOW()),
-- Líneas para Administración
('j6666666-6666-6666-6666-666666666666', 'Recursos Humanos', 'esc33333-3333-3333-3333-333333333333', 'Línea de gestión de talento humano', true, NOW(), NOW()),
('j7777777-7777-7777-7777-777777777777', 'Marketing Digital', 'esc33333-3333-3333-3333-333333333333', 'Línea de marketing en redes', true, NOW(), NOW()),
-- Líneas para Contabilidad
('j8888888-8888-8888-8888-888888888888', 'Auditoría', 'esc44444-4444-4444-4444-444444444444', 'Línea de auditoría financiera', true, NOW(), NOW()),
('j9999999-9999-9999-9999-999999999999', 'Tributación', 'esc44444-4444-4444-4444-444444444444', 'Línea de gestión tributaria', true, NOW(), NOW()),
-- Líneas para Enfermería
('jaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Enfermería Clínica', 'esc55555-5555-5555-5555-555555555555', 'Línea de atención clínica', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- RESUMEN DE DATOS INSERTADOS (CORE DB)
-- =============================================
-- ✅ facultades: 3 registros
-- ✅ escuelas: 5 registros
-- ✅ lineas_facultad: 10 registros
-- =============================================
-- TOTAL: 18 registros
-- =============================================
