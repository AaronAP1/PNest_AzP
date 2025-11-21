-- =============================================
-- SCRIPT DE INSERCIÓN DE DATOS DE PRUEBA
-- Base de Datos: ppp_core (CORE SERVICE)
-- Fecha: 2025-11-21 (CORREGIDO CON UUIDS VALIDOS)
-- =============================================

-- =============================================
-- PASO 1: FACULTADES
-- =============================================
INSERT INTO facultad (id, nombre, codigo, descripcion, estado, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Facultad de Ingenieria y Arquitectura', 'FIA', 'Facultad dedicada a carreras de ingenieria', 'ACTIVO', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Facultad de Ciencias Empresariales', 'FCE', 'Facultad de negocios y administracion', 'ACTIVO', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Facultad de Ciencias de la Salud', 'FCS', 'Facultad medica y paramedica', 'ACTIVO', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 2: ESCUELAS
-- =============================================
INSERT INTO escuela (id, nombre, codigo, id_facultad, descripcion, estado, created_at, updated_at) VALUES
('11111111-aaaa-aaaa-aaaa-111111111111', 'Ingenieria de Sistemas', 'IS', '11111111-1111-1111-1111-111111111111', 'Escuela Profesional de Ingenieria de Sistemas', 'ACTIVO', NOW(), NOW()),
('22222222-aaaa-aaaa-aaaa-222222222222', 'Ingenieria Civil', 'IC', '11111111-1111-1111-1111-111111111111', 'Escuela Profesional de Ingenieria Civil', 'ACTIVO', NOW(), NOW()),
('33333333-aaaa-aaaa-aaaa-333333333333', 'Administracion', 'ADM', '22222222-2222-2222-2222-222222222222', 'Escuela Profesional de Administracion', 'ACTIVO', NOW(), NOW()),
('44444444-aaaa-aaaa-aaaa-444444444444', 'Contabilidad', 'CONT', '22222222-2222-2222-2222-222222222222', 'Escuela Profesional de Contabilidad', 'ACTIVO', NOW(), NOW()),
('55555555-aaaa-aaaa-aaaa-555555555555', 'Enfermeria', 'ENF', '33333333-3333-3333-3333-333333333333', 'Escuela Profesional de Enfermeria', 'ACTIVO', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 3: LINEAS_FACULTAD
-- =============================================
INSERT INTO linea_facultad (id, nombre, codigo, id_escuela, estado, created_at, updated_at) VALUES
('11111111-bbbb-bbbb-bbbb-111111111111', 'Desarrollo de Software', 'DS', '11111111-aaaa-aaaa-aaaa-111111111111', 'ACTIVO', NOW(), NOW()),
('22222222-bbbb-bbbb-bbbb-222222222222', 'Inteligencia Artificial', 'IA', '11111111-aaaa-aaaa-aaaa-111111111111', 'ACTIVO', NOW(), NOW()),
('33333333-bbbb-bbbb-bbbb-333333333333', 'Seguridad Informatica', 'SI', '11111111-aaaa-aaaa-aaaa-111111111111', 'ACTIVO', NOW(), NOW()),
('44444444-bbbb-bbbb-bbbb-444444444444', 'Estructuras', 'EST', '22222222-aaaa-aaaa-aaaa-222222222222', 'ACTIVO', NOW(), NOW()),
('55555555-bbbb-bbbb-bbbb-555555555555', 'Geotecnia', 'GEO', '22222222-aaaa-aaaa-aaaa-222222222222', 'ACTIVO', NOW(), NOW()),
('66666666-bbbb-bbbb-bbbb-666666666666', 'Recursos Humanos', 'RH', '33333333-aaaa-aaaa-aaaa-333333333333', 'ACTIVO', NOW(), NOW()),
('77777777-bbbb-bbbb-bbbb-777777777777', 'Marketing Digital', 'MD', '33333333-aaaa-aaaa-aaaa-333333333333', 'ACTIVO', NOW(), NOW()),
('88888888-bbbb-bbbb-bbbb-888888888888', 'Auditoria', 'AUD', '44444444-aaaa-aaaa-aaaa-444444444444', 'ACTIVO', NOW(), NOW()),
('99999999-bbbb-bbbb-bbbb-999999999999', 'Tributacion', 'TRIB', '44444444-aaaa-aaaa-aaaa-444444444444', 'ACTIVO', NOW(), NOW()),
('aaaaaaaa-bbbb-bbbb-bbbb-aaaaaaaaaaaa', 'Enfermeria Clinica', 'EC', '55555555-aaaa-aaaa-aaaa-555555555555', 'ACTIVO', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
