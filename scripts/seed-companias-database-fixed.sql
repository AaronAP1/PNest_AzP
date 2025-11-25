-- =============================================
-- SCRIPT DE INSERCIÓN DE DATOS DE PRUEBA
-- Base de Datos: ppp_companias (COMPANIAS SERVICE)
-- Fecha: 2025-11-21 (CORREGIDO)
-- =============================================

-- =============================================
-- PASO 1: EMPRESAS (estructura simplificada)
-- =============================================
INSERT INTO empresa (id, nombre, nombre_representante, ruc, sector, grado_academico, cargo_representante, telefono, direccion, created_at, updated_at) VALUES
('emp11111-1111-1111-1111-111111111111', 'TECNOLOGIA DIGITAL S.A.C.', 'Juan Perez Lopez', '20123456789', 'Tecnologia', 'Ingeniero', 'Gerente General', '01-2345678', 'Av. Arequipa 1234, Lima', NOW(), NOW()),
('emp22222-2222-2222-2222-222222222222', 'INNOVACION SOFTWARE E.I.R.L.', 'Maria Torres Garcia', '20987654321', 'Software', 'Ingeniero', 'Gerente Tecnico', '01-8765432', 'Jr. Ucayali 567, Lima', NOW(), NOW()),
('emp33333-3333-3333-3333-333333333333', 'CONSTRUCTORA PERU S.A.', 'Carlos Ruiz Diaz', '20456789123', 'Construccion', 'Ingeniero', 'Jefe de Proyectos', '01-4567891', 'Av. Javier Prado 890, Lima', NOW(), NOW()),
('emp44444-4444-4444-4444-444444444444', 'CONSULTORA EMPRESARIAL S.A.C.', 'Ana Flores Mendoza', '20321654987', 'Consultoria', 'Administrador', 'Director Ejecutivo', '01-3216549', 'Av. La Marina 345, Lima', NOW(), NOW()),
('emp55555-5555-5555-5555-555555555555', 'SALUD INTEGRAL CLINICA E.I.R.L.', 'Luis Morales Castro', '20789456123', 'Salud', 'Medico', 'Director Medico', '01-7894561', 'Av. Brasil 678, Lima', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 2: SOLICITUDES_PPP (simplificado)
-- =============================================
INSERT INTO solicitud_ppp (id, id_alumno, id_supervisor, id_empresa, estado, created_at, updated_at) VALUES
('g1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'emp11111-1111-1111-1111-111111111111', 'aprobado', NOW(), NOW()),
('g2222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 'emp22222-2222-2222-2222-222222222222', 'aprobado', NOW(), NOW()),
('g3333333-3333-3333-3333-333333333333', 'e3333333-3333-3333-3333-333333333333', 'd3333333-3333-3333-3333-333333333333', 'emp33333-3333-3333-3333-333333333333', 'aprobado', NOW(), NOW()),
('g4444444-4444-4444-4444-444444444444', 'e4444444-4444-4444-4444-444444444444', 'd1111111-1111-1111-1111-111111111111', 'emp44444-4444-4444-4444-444444444444', 'aprobado', NOW(), NOW()),
('g5555555-5555-5555-5555-555555555555', 'e5555555-5555-5555-5555-555555555555', 'd2222222-2222-2222-2222-222222222222', 'emp55555-5555-5555-5555-555555555555', 'pendiente', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 3: CARTAS_PRESENTACION (con fecha_inicio, area_practica, estado enum)
-- =============================================
INSERT INTO carta_presentacion (id, id_alumno, id_empresa, id_solicitud, area_practica, fecha_inicio, estado, created_at, updated_at) VALUES
('carta111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'emp11111-1111-1111-1111-111111111111', 'g1111111-1111-1111-1111-111111111111', 'Desarrollo Web', NOW() - INTERVAL '30 days', 'aprobado', NOW(), NOW()),
('carta222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', 'emp22222-2222-2222-2222-222222222222', 'g2222222-2222-2222-2222-222222222222', 'Backend Development', NOW() - INTERVAL '25 days', 'aprobado', NOW(), NOW()),
('carta333-3333-3333-3333-333333333333', 'e3333333-3333-3333-3333-333333333333', 'emp33333-3333-3333-3333-333333333333', 'g3333333-3333-3333-3333-333333333333', 'Supervision de Obra', NOW() - INTERVAL '20 days', 'aprobado', NOW(), NOW()),
('carta444-4444-4444-4444-444444444444', 'e4444444-4444-4444-4444-444444444444', 'emp44444-4444-4444-4444-444444444444', 'g4444444-4444-4444-4444-444444444444', 'Analisis Empresarial', NOW() - INTERVAL '15 days', 'aprobado', NOW(), NOW()),
('carta555-5555-5555-5555-555555555555', 'e5555555-5555-5555-5555-555555555555', 'emp55555-5555-5555-5555-555555555555', 'g5555555-5555-5555-5555-555555555555', 'Atencion Pacientes', NOW() - INTERVAL '10 days', 'borrador', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 4: REUNIONES (solo estado)
-- =============================================
INSERT INTO reuniones (id, id_solicitud, estado, created_at, updated_at) VALUES
('reun1111-1111-1111-1111-111111111111', 'g1111111-1111-1111-1111-111111111111', 'completada', NOW(), NOW()),
('reun2222-2222-2222-2222-222222222222', 'g1111111-1111-1111-1111-111111111111', 'completada', NOW(), NOW()),
('reun3333-3333-3333-3333-333333333333', 'g2222222-2222-2222-2222-222222222222', 'completada', NOW(), NOW()),
('reun4444-4444-4444-4444-444444444444', 'g3333333-3333-3333-3333-333333333333', 'completada', NOW(), NOW()),
('reun5555-5555-5555-5555-555555555555', 'g4444444-4444-4444-4444-444444444444', 'pendiente', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 5: TIPO_DOCUMENTO (sin requerido)
-- =============================================
INSERT INTO tipo_documento (id, nombre, descripcion, created_at, updated_at) VALUES
('tipo1111-1111-1111-1111-111111111111', 'Plan de Practicas', 'Documento con objetivos y actividades', NOW(), NOW()),
('tipo2222-2222-2222-2222-222222222222', 'Informe Mensual', 'Reporte de actividades del mes', NOW(), NOW()),
('tipo3333-3333-3333-3333-333333333333', 'Informe Final', 'Documento final de practicas', NOW(), NOW()),
('tipo4444-4444-4444-4444-444444444444', 'Constancia de Practicas', 'Constancia emitida por empresa', NOW(), NOW()),
('tipo5555-5555-5555-5555-555555555555', 'Evidencias Fotograficas', 'Fotos de actividades realizadas', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PASO 6: DOCUMENTO (id_solicitud_ppp, id_tipodocumento, ruta_archivo)
-- =============================================
INSERT INTO documento (id, nombre_archivo, ruta_archivo, id_solicitud_ppp, id_tipodocumento, subido_por, generado_por, created_at, updated_at) VALUES
('doc11111-1111-1111-1111-111111111111', 'Plan_Practicas_TechDigital.pdf', '/documents/plan_1.pdf', 'g1111111-1111-1111-1111-111111111111', 'tipo1111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', NOW(), NOW()),
('doc22222-2222-2222-2222-222222222222', 'Informe_Mes1_TechDigital.pdf', '/documents/informe_1.pdf', 'g1111111-1111-1111-1111-111111111111', 'tipo2222-2222-2222-2222-222222222222', 'e1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', NOW(), NOW()),
('doc33333-3333-3333-3333-333333333333', 'Plan_Practicas_InnovaSoft.pdf', '/documents/plan_2.pdf', 'g2222222-2222-2222-2222-222222222222', 'tipo1111-1111-1111-1111-111111111111', 'e2222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', NOW(), NOW()),
('doc44444-4444-4444-4444-444444444444', 'Plan_Practicas_ConstruPeru.pdf', '/documents/plan_3.pdf', 'g3333333-3333-3333-3333-333333333333', 'tipo1111-1111-1111-1111-111111111111', 'e3333333-3333-3333-3333-333333333333', 'e3333333-3333-3333-3333-333333333333', NOW(), NOW()),
('doc55555-5555-5555-5555-555555555555', 'Plan_Practicas_ConsuEmpresa.pdf', '/documents/plan_4.pdf', 'g4444444-4444-4444-4444-444444444444', 'tipo1111-1111-1111-1111-111111111111', 'e4444444-4444-4444-4444-444444444444', 'e4444444-4444-4444-4444-444444444444', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- RESUMEN: 5 empresas, 5 solicitudes, 5 cartas, 5 reuniones, 5 tipos_doc, 5 documentos = 30 registros
-- =============================================
