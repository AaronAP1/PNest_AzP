-- =============================================
-- SCRIPT DE INSERCIÓN DE DATOS DE PRUEBA
-- Base de Datos: pnest_companias_db (COMPANIAS SERVICE)
-- Fecha: 2025-11-21
-- =============================================
-- Este script inserta datos de empresas y solicitudes PPP

-- =============================================
-- PASO 1: EMPRESAS (tabla independiente)
-- =============================================
INSERT INTO empresa (id, ruc, razon_social, nombre_comercial, direccion, telefono, email, sector, estado, created_at, updated_at) VALUES
('emp11111-1111-1111-1111-111111111111', '20123456789', 'TECNOLOGÍA DIGITAL S.A.C.', 'TechDigital', 'Av. Arequipa 1234, Lima', '01-2345678', 'contacto@techdigital.com', 'Tecnología', true, NOW(), NOW()),
('emp22222-2222-2222-2222-222222222222', '20987654321', 'INNOVACIÓN SOFTWARE E.I.R.L.', 'InnovaSoft', 'Jr. Ucayali 567, Lima', '01-8765432', 'info@innovasoft.com', 'Software', true, NOW(), NOW()),
('emp33333-3333-3333-3333-333333333333', '20456789123', 'CONSTRUCTORA PERÚ S.A.', 'ConstruPeru', 'Av. Javier Prado 890, Lima', '01-4567891', 'ventas@construperu.com', 'Construcción', true, NOW(), NOW()),
('emp44444-4444-4444-4444-444444444444', '20321654987', 'CONSULTORA EMPRESARIAL S.A.C.', 'ConsuEmpresa', 'Av. La Marina 345, Lima', '01-3216549', 'contacto@consuempresa.com', 'Consultoría', true, NOW(), NOW()),
('emp55555-5555-5555-5555-555555555555', '20789456123', 'SALUD INTEGRAL CLÍNICA E.I.R.L.', 'ClinicaIntegral', 'Av. Brasil 678, Lima', '01-7894561', 'citas@clinicaintegral.com', 'Salud', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 2: CARTAS_PRESENTACION (depende de empresas y alumnos externos)
-- =============================================
INSERT INTO carta_presentacion (id, id_alumno, id_empresa, fecha_emision, fecha_vencimiento, estado, observaciones, created_at, updated_at) VALUES
('carta111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'emp11111-1111-1111-1111-111111111111', NOW() - INTERVAL '30 days', NOW() + INTERVAL '60 days', 'APROBADA', 'Carta aprobada para prácticas en área de desarrollo', NOW(), NOW()),
('carta222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', 'emp22222-2222-2222-2222-222222222222', NOW() - INTERVAL '25 days', NOW() + INTERVAL '65 days', 'APROBADA', 'Carta aprobada para prácticas en innovación', NOW(), NOW()),
('carta333-3333-3333-3333-333333333333', 'e3333333-3333-3333-3333-333333333333', 'emp33333-3333-3333-3333-333333333333', NOW() - INTERVAL '20 days', NOW() + INTERVAL '70 days', 'APROBADA', 'Carta aprobada para prácticas en obra', NOW(), NOW()),
('carta444-4444-4444-4444-444444444444', 'e4444444-4444-4444-4444-444444444444', 'emp44444-4444-4444-4444-444444444444', NOW() - INTERVAL '15 days', NOW() + INTERVAL '75 days', 'APROBADA', 'Carta aprobada para consultoría', NOW(), NOW()),
('carta555-5555-5555-5555-555555555555', 'e5555555-5555-5555-5555-555555555555', 'emp55555-5555-5555-5555-555555555555', NOW() - INTERVAL '10 days', NOW() + INTERVAL '80 days', 'APROBADA', 'Carta aprobada para área clínica', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 3: SOLICITUDES_PPP (depende de cartas, alumnos, supervisores)
-- =============================================
INSERT INTO solicitud_ppp (id, id_alumno, id_supervisor, id_empresa, id_carta_presentacion, fecha_inicio, fecha_fin, horas_totales, estado, observaciones, created_at, updated_at) VALUES
('g1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'emp11111-1111-1111-1111-111111111111', 'carta111-1111-1111-1111-111111111111', NOW() - INTERVAL '30 days', NOW() + INTERVAL '150 days', 720, 'EN_PROCESO', 'Solicitud activa en TechDigital - Desarrollo Web', NOW(), NOW()),
('g2222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 'emp22222-2222-2222-2222-222222222222', 'carta222-2222-2222-2222-222222222222', NOW() - INTERVAL '25 days', NOW() + INTERVAL '155 days', 720, 'EN_PROCESO', 'Solicitud activa en InnovaSoft - Backend Development', NOW(), NOW()),
('g3333333-3333-3333-3333-333333333333', 'e3333333-3333-3333-3333-333333333333', 'd3333333-3333-3333-3333-333333333333', 'emp33333-3333-3333-3333-333333333333', 'carta333-3333-3333-3333-333333333333', NOW() - INTERVAL '20 days', NOW() + INTERVAL '160 days', 720, 'EN_PROCESO', 'Solicitud activa en ConstruPeru - Supervisión de Obra', NOW(), NOW()),
('g4444444-4444-4444-4444-444444444444', 'e4444444-4444-4444-4444-444444444444', 'd1111111-1111-1111-1111-111111111111', 'emp44444-4444-4444-4444-444444444444', 'carta444-4444-4444-4444-444444444444', NOW() - INTERVAL '15 days', NOW() + INTERVAL '165 days', 720, 'EN_PROCESO', 'Solicitud activa en ConsuEmpresa - Análisis Empresarial', NOW(), NOW()),
('g5555555-5555-5555-5555-555555555555', 'e5555555-5555-5555-5555-555555555555', 'd2222222-2222-2222-2222-222222222222', 'emp55555-5555-5555-5555-555555555555', 'carta555-5555-5555-5555-555555555555', NOW() - INTERVAL '10 days', NOW() + INTERVAL '170 days', 720, 'EN_PROCESO', 'Solicitud activa en ClinicaIntegral - Atención Pacientes', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 4: REUNIONES (depende de solicitudes_ppp)
-- =============================================
INSERT INTO reuniones (id, id_solicitud, fecha_reunion, tipo, asunto, descripcion, estado, created_at, updated_at) VALUES
('reun1111-1111-1111-1111-111111111111', 'g1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '20 days', 'PRESENCIAL', 'Reunión de inicio de prácticas', 'Primera reunión para establecer objetivos y plan de trabajo', 'REALIZADA', NOW(), NOW()),
('reun2222-2222-2222-2222-222222222222', 'g1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '10 days', 'VIRTUAL', 'Seguimiento semanal', 'Revisión de avances en desarrollo web', 'REALIZADA', NOW(), NOW()),
('reun3333-3333-3333-3333-333333333333', 'g2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '15 days', 'PRESENCIAL', 'Evaluación de medio término', 'Evaluación de competencias desarrolladas', 'REALIZADA', NOW(), NOW()),
('reun4444-4444-4444-4444-444444444444', 'g3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '12 days', 'VIRTUAL', 'Revisión de proyecto', 'Revisión de planos y documentación técnica', 'REALIZADA', NOW(), NOW()),
('reun5555-5555-5555-5555-555555555555', 'g4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '8 days', 'PRESENCIAL', 'Capacitación metodologías', 'Capacitación en metodologías de consultoría', 'REALIZADA', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 5: TIPO_DOCUMENTOS (tabla independiente)
-- =============================================
INSERT INTO tipo_documento (id, nombre, descripcion, requerido, estado, created_at, updated_at) VALUES
('tipo1111-1111-1111-1111-111111111111', 'Plan de Prácticas', 'Documento con objetivos y actividades', true, true, NOW(), NOW()),
('tipo2222-2222-2222-2222-222222222222', 'Informe Mensual', 'Reporte de actividades del mes', true, true, NOW(), NOW()),
('tipo3333-3333-3333-3333-333333333333', 'Informe Final', 'Documento final de prácticas', true, true, NOW(), NOW()),
('tipo4444-4444-4444-4444-444444444444', 'Constancia de Prácticas', 'Constancia emitida por empresa', true, true, NOW(), NOW()),
('tipo5555-5555-5555-5555-555555555555', 'Evidencias Fotográficas', 'Fotos de actividades realizadas', false, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 6: DOCUMENTOS (depende de tipo_documentos y solicitudes)
-- =============================================
INSERT INTO documento (id, id_tipo_documento, id_solicitud, nombre_archivo, url_archivo, subido_por, generado_por, fecha_subida, estado, created_at, updated_at) VALUES
('doc11111-1111-1111-1111-111111111111', 'tipo1111-1111-1111-1111-111111111111', 'g1111111-1111-1111-1111-111111111111', 'Plan_Practicas_TechDigital.pdf', '/documents/plan_1.pdf', 'e1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '28 days', 'APROBADO', NOW(), NOW()),
('doc22222-2222-2222-2222-222222222222', 'tipo2222-2222-2222-2222-222222222222', 'g1111111-1111-1111-1111-111111111111', 'Informe_Mes1_TechDigital.pdf', '/documents/informe_1.pdf', 'e1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '15 days', 'APROBADO', NOW(), NOW()),
('doc33333-3333-3333-3333-333333333333', 'tipo1111-1111-1111-1111-111111111111', 'g2222222-2222-2222-2222-222222222222', 'Plan_Practicas_InnovaSoft.pdf', '/documents/plan_2.pdf', 'e2222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '23 days', 'APROBADO', NOW(), NOW()),
('doc44444-4444-4444-4444-444444444444', 'tipo1111-1111-1111-1111-111111111111', 'g3333333-3333-3333-3333-333333333333', 'Plan_Practicas_ConstruPeru.pdf', '/documents/plan_3.pdf', 'e3333333-3333-3333-3333-333333333333', 'e3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '18 days', 'APROBADO', NOW(), NOW()),
('doc55555-5555-5555-5555-555555555555', 'tipo1111-1111-1111-1111-111111111111', 'g4444444-4444-4444-4444-444444444444', 'Plan_Practicas_ConsuEmpresa.pdf', '/documents/plan_4.pdf', 'e4444444-4444-4444-4444-444444444444', 'e4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '13 days', 'APROBADO', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- RESUMEN DE DATOS INSERTADOS (COMPANIAS DB)
-- =============================================
-- ✅ empresas: 5 registros
-- ✅ cartas_presentacion: 5 registros
-- ✅ solicitudes_ppp: 5 registros
-- ✅ reuniones: 5 registros
-- ✅ tipo_documentos: 5 registros
-- ✅ documentos: 5 registros
-- =============================================
-- TOTAL: 30 registros
-- =============================================

-- NOTA: Los id_alumno y id_supervisor deben existir en la base de datos AUTH
-- Ejecuta primero el script seed-auth-database.sql
