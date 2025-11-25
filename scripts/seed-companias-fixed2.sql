-- =============================================
-- SCRIPT DE INSERCIÓN DE DATOS DE PRUEBA
-- Base de Datos: ppp_companias (COMPANIAS SERVICE)
-- Fecha: 2025-11-21 (CORREGIDO CON UUIDS VALIDOS)
-- =============================================

-- =============================================
-- PASO 1: EMPRESAS
-- =============================================
INSERT INTO empresa (id, nombre, nombre_representante, ruc, sector, grado_academico, cargo_representante, telefono, direccion, created_at, updated_at) VALUES
('11111111-aaaa-1111-1111-111111111111', 'TECNOLOGIA DIGITAL S.A.C.', 'Juan Perez Lopez', '20123456789', 'Tecnologia', 'Ingeniero', 'Gerente General', '01-2345678', 'Av. Arequipa 1234, Lima', NOW(), NOW()),
('22222222-aaaa-2222-2222-222222222222', 'INNOVACION SOFTWARE E.I.R.L.', 'Maria Torres Garcia', '20987654321', 'Software', 'Ingeniero', 'Gerente Tecnico', '01-8765432', 'Jr. Ucayali 567, Lima', NOW(), NOW()),
('33333333-aaaa-3333-3333-333333333333', 'CONSTRUCTORA PERU S.A.', 'Carlos Ruiz Diaz', '20456789123', 'Construccion', 'Ingeniero', 'Jefe de Proyectos', '01-4567891', 'Av. Javier Prado 890, Lima', NOW(), NOW()),
('44444444-aaaa-4444-4444-444444444444', 'CONSULTORA EMPRESARIAL S.A.C.', 'Ana Flores Mendoza', '20321654987', 'Consultoria', 'Administrador', 'Director Ejecutivo', '01-3216549', 'Av. La Marina 345, Lima', NOW(), NOW()),
('55555555-aaaa-5555-5555-555555555555', 'SALUD INTEGRAL CLINICA E.I.R.L.', 'Luis Morales Castro', '20789456123', 'Salud', 'Medico', 'Director Medico', '01-7894561', 'Av. Brasil 678, Lima', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 2: SOLICITUDES_PPP
-- =============================================
INSERT INTO solicitud_ppp (id, id_alumno, id_supervisor, id_empresa, estado, created_at, updated_at) VALUES
('11111111-bbbb-1111-1111-111111111111', '11111111-ffff-ffff-ffff-111111111111', '11111111-eeee-eeee-eeee-111111111111', '11111111-aaaa-1111-1111-111111111111', 'aprobado', NOW(), NOW()),
('22222222-bbbb-2222-2222-222222222222', '22222222-ffff-ffff-ffff-222222222222', '22222222-eeee-eeee-eeee-222222222222', '22222222-aaaa-2222-2222-222222222222', 'aprobado', NOW(), NOW()),
('33333333-bbbb-3333-3333-333333333333', '33333333-ffff-ffff-ffff-333333333333', '33333333-eeee-eeee-eeee-333333333333', '33333333-aaaa-3333-3333-333333333333', 'aprobado', NOW(), NOW()),
('44444444-bbbb-4444-4444-444444444444', '44444444-ffff-ffff-ffff-444444444444', '11111111-eeee-eeee-eeee-111111111111', '44444444-aaaa-4444-4444-444444444444', 'aprobado', NOW(), NOW()),
('55555555-bbbb-5555-5555-555555555555', '55555555-ffff-ffff-ffff-555555555555', '22222222-eeee-eeee-eeee-222222222222', '55555555-aaaa-5555-5555-555555555555', 'pendiente', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 3: CARTAS_PRESENTACION
-- =============================================
INSERT INTO carta_presentacion (id, id_alumno, id_empresa, id_solicitud, area_practica, fecha_inicio, estado, created_at, updated_at) VALUES
('11111111-cccc-1111-1111-111111111111', '11111111-ffff-ffff-ffff-111111111111', '11111111-aaaa-1111-1111-111111111111', '11111111-bbbb-1111-1111-111111111111', 'Desarrollo Web', NOW() - INTERVAL '30 days', 'aprobada', NOW(), NOW()),
('22222222-cccc-2222-2222-222222222222', '22222222-ffff-ffff-ffff-222222222222', '22222222-aaaa-2222-2222-222222222222', '22222222-bbbb-2222-2222-222222222222', 'Backend Development', NOW() - INTERVAL '25 days', 'aprobada', NOW(), NOW()),
('33333333-cccc-3333-3333-333333333333', '33333333-ffff-ffff-ffff-333333333333', '33333333-aaaa-3333-3333-333333333333', '33333333-bbbb-3333-3333-333333333333', 'Supervision de Obra', NOW() - INTERVAL '20 days', 'aprobada', NOW(), NOW()),
('44444444-cccc-4444-4444-444444444444', '44444444-ffff-ffff-ffff-444444444444', '44444444-aaaa-4444-4444-444444444444', '44444444-bbbb-4444-4444-444444444444', 'Analisis Empresarial', NOW() - INTERVAL '15 days', 'aprobada', NOW(), NOW()),
('55555555-cccc-5555-5555-555555555555', '55555555-ffff-ffff-ffff-555555555555', '55555555-aaaa-5555-5555-555555555555', '55555555-bbbb-5555-5555-555555555555', 'Atencion Pacientes', NOW() - INTERVAL '10 days', 'borrador', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 4: REUNIONES
-- =============================================
INSERT INTO reuniones (id, id_solicitud, estado, created_at, updated_at) VALUES
('11111111-dddd-1111-1111-111111111111', '11111111-bbbb-1111-1111-111111111111', 'realizada', NOW(), NOW()),
('22222222-dddd-2222-2222-222222222222', '11111111-bbbb-1111-1111-111111111111', 'realizada', NOW(), NOW()),
('33333333-dddd-3333-3333-333333333333', '22222222-bbbb-2222-2222-222222222222', 'realizada', NOW(), NOW()),
('44444444-dddd-4444-4444-444444444444', '33333333-bbbb-3333-3333-333333333333', 'realizada', NOW(), NOW()),
('55555555-dddd-5555-5555-555555555555', '44444444-bbbb-4444-4444-444444444444', 'pendiente', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 5: TIPO_DOCUMENTO
-- =============================================
INSERT INTO tipo_documento (id, nombre, descripcion, created_at, updated_at) VALUES
('11111111-eeee-1111-1111-111111111111', 'Plan de Practicas', 'Documento con objetivos y actividades', NOW(), NOW()),
('22222222-eeee-2222-2222-222222222222', 'Informe Mensual', 'Reporte de actividades del mes', NOW(), NOW()),
('33333333-eeee-3333-3333-333333333333', 'Informe Final', 'Documento final de practicas', NOW(), NOW()),
('44444444-eeee-4444-4444-444444444444', 'Constancia de Practicas', 'Constancia emitida por empresa', NOW(), NOW()),
('55555555-eeee-5555-5555-555555555555', 'Evidencias Fotograficas', 'Fotos de actividades realizadas', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 6: DOCUMENTO
-- =============================================
INSERT INTO documento (id, nombre_archivo, ruta_archivo, id_solicitud_ppp, id_tipodocumento, subido_por, generado_por, created_at, updated_at) VALUES
('11111111-ffff-1111-1111-111111111111', 'Plan_Practicas_TechDigital.pdf', '/documents/plan_1.pdf', '11111111-bbbb-1111-1111-111111111111', '11111111-eeee-1111-1111-111111111111', '11111111-ffff-ffff-ffff-111111111111', '11111111-ffff-ffff-ffff-111111111111', NOW(), NOW()),
('22222222-ffff-2222-2222-222222222222', 'Informe_Mes1_TechDigital.pdf', '/documents/informe_1.pdf', '11111111-bbbb-1111-1111-111111111111', '22222222-eeee-2222-2222-222222222222', '11111111-ffff-ffff-ffff-111111111111', '11111111-ffff-ffff-ffff-111111111111', NOW(), NOW()),
('33333333-ffff-3333-3333-333333333333', 'Plan_Practicas_InnovaSoft.pdf', '/documents/plan_2.pdf', '22222222-bbbb-2222-2222-222222222222', '11111111-eeee-1111-1111-111111111111', '22222222-ffff-ffff-ffff-222222222222', '22222222-ffff-ffff-ffff-222222222222', NOW(), NOW()),
('44444444-ffff-4444-4444-444444444444', 'Plan_Practicas_ConstruPeru.pdf', '/documents/plan_3.pdf', '33333333-bbbb-3333-3333-333333333333', '11111111-eeee-1111-1111-111111111111', '33333333-ffff-ffff-ffff-333333333333', '33333333-ffff-ffff-ffff-333333333333', NOW(), NOW()),
('55555555-ffff-5555-5555-555555555555', 'Plan_Practicas_ConsuEmpresa.pdf', '/documents/plan_4.pdf', '44444444-bbbb-4444-4444-444444444444', '11111111-eeee-1111-1111-111111111111', '44444444-ffff-ffff-ffff-444444444444', '44444444-ffff-ffff-ffff-444444444444', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
