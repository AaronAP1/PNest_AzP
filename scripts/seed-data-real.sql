-- ============================================================
-- SCRIPT DE DATOS REALES PARA BD COMPAÑÍAS (23 TABLAS)
-- ============================================================
-- ORDEN: Siguiendo dependencias (tablas sin FK primero)
-- Ejecutar paso por paso en Azure PostgreSQL
-- ============================================================

-- ============================================================
-- PASO 1: EMPRESAS (Sin dependencias)
-- ============================================================
\echo '======================================'
\echo 'PASO 1: Insertando Empresas'
\echo '======================================'

INSERT INTO empresa (id, nombre, nombre_representante, ruc, sector, grado_academico, cargo_representante, telefono, direccion, created_at, updated_at)
VALUES 
  -- Empresa 1: Banco de Crédito
  (
    '11111111-1111-1111-1111-111111111111',
    'BANCO DE CREDITO DEL PERU',
    'Carlos Alberto Martinez López',
    '20100047218',
    'Servicios Financieros',
    'Maestría en Administración de Empresas',
    'Gerente de Recursos Humanos',
    '01-3139000',
    'JR. CENTENARIO NRO 156 URB. LADERAS DE MELGAREJO, Lima',
    NOW(),
    NOW()
  ),
  -- Empresa 2: Rextie
  (
    '22222222-2222-2222-2222-222222222222',
    'REXTIE S.A.C.',
    'María Elena Rodriguez Gómez',
    '20601030013',
    'Tecnología Financiera',
    'Licenciatura en Economía',
    'Jefa de Talento Humano',
    '01-7005800',
    'AV. JOSE PARDO NRO 620 INT 501, Miraflores, Lima',
    NOW(),
    NOW()
  ),
  -- Empresa 3: Interbank
  (
    '33333333-3333-3333-3333-333333333333',
    'INTERBANK',
    'José Luis Fernández Castro',
    '20100053455',
    'Servicios Financieros',
    'Maestría en Finanzas',
    'Director de Recursos Humanos',
    '01-3119000',
    'AV. CARLOS VILLARÁN NRO 140, La Victoria, Lima',
    NOW(),
    NOW()
  ),
  -- Empresa 4: Saga Falabella
  (
    '44444444-4444-4444-4444-444444444444',
    'SAGA FALABELLA S.A.',
    'Ana Patricia Gonzales Ruiz',
    '20100128056',
    'Retail',
    'Licenciatura en Administración',
    'Gerente de Gestión Humana',
    '01-2116500',
    'AV. PASEO DE LA REPUBLICA NRO 3220, San Isidro, Lima',
    NOW(),
    NOW()
  ),
  -- Empresa 5: Alicorp
  (
    '55555555-5555-5555-5555-555555555555',
    'ALICORP S.A.A.',
    'Roberto Carlos Mendoza Silva',
    '20100055237',
    'Manufactura y Consumo',
    'MBA',
    'Gerente General de RRHH',
    '01-3156000',
    'AV. ARGENTINA NRO 4793, Callao',
    NOW(),
    NOW()
  );

SELECT COUNT(*) as "Total Empresas Insertadas" FROM empresa;

-- ============================================================
-- PASO 2: SOLICITUDES PPP (Sin FK a otras tablas locales)
-- ============================================================
\echo '======================================'
\echo 'PASO 2: Insertando Solicitudes PPP'
\echo '======================================'

INSERT INTO solicitud_ppp (id, id_supervisor, id_alumno, estado, created_at, updated_at)
VALUES 
  -- Solicitud 1: Alumno para BCP
  (
    'a0000001-0001-0001-0001-000000000001',
    'sup00001-0001-0001-0001-000000000001', -- ID Supervisor (Auth Service)
    'alu00001-0001-0001-0001-000000000001', -- ID Alumno (Auth Service)
    'en_proceso',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '5 days'
  ),
  -- Solicitud 2: Alumno para Rextie
  (
    'a0000002-0002-0002-0002-000000000002',
    'sup00001-0001-0001-0001-000000000001',
    'alu00002-0002-0002-0002-000000000002',
    'aprobado',
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '10 days'
  ),
  -- Solicitud 3: Alumno para Interbank
  (
    'a0000003-0003-0003-0003-000000000003',
    'sup00002-0002-0002-0002-000000000002',
    'alu00003-0003-0003-0003-000000000003',
    'pendiente',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '1 day'
  ),
  -- Solicitud 4: Alumno para Saga Falabella
  (
    'a0000004-0004-0004-0004-000000000004',
    'sup00002-0002-0002-0002-000000000002',
    'alu00004-0004-0004-0004-000000000004',
    'en_proceso',
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '3 days'
  ),
  -- Solicitud 5: Alumno para Alicorp
  (
    'a0000005-0005-0005-0005-000000000005',
    'sup00003-0003-0003-0003-000000000003',
    'alu00005-0005-0005-0005-000000000005',
    'aprobado',
    NOW() - INTERVAL '45 days',
    NOW() - INTERVAL '20 days'
  ),
  -- Solicitud 6: Rechazada
  (
    'a0000006-0006-0006-0006-000000000006',
    'sup00001-0001-0001-0001-000000000001',
    'alu00006-0006-0006-0006-000000000006',
    'rechazado',
    NOW() - INTERVAL '60 days',
    NOW() - INTERVAL '50 days'
  );

SELECT COUNT(*) as "Total Solicitudes PPP Insertadas" FROM solicitud_ppp;

-- ============================================================
-- PASO 3: CARTAS DE PRESENTACIÓN (FK: id_solicitud opcional)
-- ============================================================
\echo '======================================'
\echo 'PASO 3: Insertando Cartas de Presentación'
\echo '======================================'

INSERT INTO carta_presentacion (id, id_solicitud, id_alumno, id_empresa, id_secretaria, area_practica, fecha_inicio, archivo, motivo_rechazo, estado, created_at, updated_at)
VALUES 
  -- Carta 1: BCP - Aprobada
  (
    'c0000001-0001-0001-0001-000000000001',
    'a0000001-0001-0001-0001-000000000001',
    'alu00001-0001-0001-0001-000000000001',
    '11111111-1111-1111-1111-111111111111', -- BCP
    'sec00001-0001-0001-0001-000000000001', -- Secretaria
    'Desarrollo de Software',
    '2025-03-01',
    'https://storage.azure.com/cartas/carta_bcp_alumno1.pdf',
    NULL,
    'aprobada',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '5 days'
  ),
  -- Carta 2: Rextie - Aprobada
  (
    'c0000002-0002-0002-0002-000000000002',
    'a0000002-0002-0002-0002-000000000002',
    'alu00002-0002-0002-0002-000000000002',
    '22222222-2222-2222-2222-222222222222', -- Rextie
    'sec00001-0001-0001-0001-000000000001',
    'Análisis de Datos',
    '2025-02-15',
    'https://storage.azure.com/cartas/carta_rextie_alumno2.pdf',
    NULL,
    'aprobada',
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '10 days'
  ),
  -- Carta 3: Interbank - Enviada (pendiente)
  (
    'c0000003-0003-0003-0003-000000000003',
    'a0000003-0003-0003-0003-000000000003',
    'alu00003-0003-0003-0003-000000000003',
    '33333333-3333-3333-3333-333333333333', -- Interbank
    'sec00002-0002-0002-0002-000000000002',
    'Análisis Financiero',
    '2025-03-15',
    'https://storage.azure.com/cartas/carta_interbank_alumno3.pdf',
    NULL,
    'enviada',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '1 day'
  ),
  -- Carta 4: Saga - Borrador
  (
    'c0000004-0004-0004-0004-000000000004',
    'a0000004-0004-0004-0004-000000000004',
    'alu00004-0004-0004-0004-000000000004',
    '44444444-4444-4444-4444-444444444444', -- Saga Falabella
    NULL,
    'Marketing Digital',
    '2025-04-01',
    NULL,
    NULL,
    'borrador',
    NOW() - INTERVAL '2 days',
    NOW()
  ),
  -- Carta 5: Alicorp - Aprobada
  (
    'c0000005-0005-0005-0005-000000000005',
    'a0000005-0005-0005-0005-000000000005',
    'alu00005-0005-0005-0005-000000000005',
    '55555555-5555-5555-5555-555555555555', -- Alicorp
    'sec00001-0001-0001-0001-000000000001',
    'Logística y Cadena de Suministro',
    '2025-01-20',
    'https://storage.azure.com/cartas/carta_alicorp_alumno5.pdf',
    NULL,
    'aprobada',
    NOW() - INTERVAL '40 days',
    NOW() - INTERVAL '20 days'
  ),
  -- Carta 6: Rechazada
  (
    'c0000006-0006-0006-0006-000000000006',
    'a0000006-0006-0006-0006-000000000006',
    'alu00006-0006-0006-0006-000000000006',
    '11111111-1111-1111-1111-111111111111', -- BCP
    'sec00002-0002-0002-0002-000000000002',
    'Recursos Humanos',
    '2025-02-01',
    'https://storage.azure.com/cartas/carta_bcp_alumno6.pdf',
    'Documentación incompleta. Faltan certificados académicos actualizados.',
    'rechazada',
    NOW() - INTERVAL '55 days',
    NOW() - INTERVAL '50 days'
  );

SELECT COUNT(*) as "Total Cartas de Presentación Insertadas" FROM carta_presentacion;

-- ============================================================
-- PASO 4: REUNIONES (FK: id_solicitud)
-- ============================================================
\echo '======================================'
\echo 'PASO 4: Insertando Reuniones'
\echo '======================================'

INSERT INTO reuniones (id, id_solicitud, estado, created_at, updated_at)
VALUES 
  -- Reuniones para Solicitud 1 (BCP)
  (
    'r0000001-0001-0001-0001-000000000001',
    'a0000001-0001-0001-0001-000000000001',
    'realizada',
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '12 days'
  ),
  (
    'r0000002-0001-0001-0001-000000000002',
    'a0000001-0001-0001-0001-000000000001',
    'realizada',
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '8 days'
  ),
  -- Reuniones para Solicitud 2 (Rextie)
  (
    'r0000003-0002-0002-0002-000000000003',
    'a0000002-0002-0002-0002-000000000002',
    'realizada',
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '25 days'
  ),
  (
    'r0000004-0002-0002-0002-000000000004',
    'a0000002-0002-0002-0002-000000000002',
    'realizada',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days'
  ),
  -- Reunión para Solicitud 3 (Interbank) - Pendiente
  (
    'r0000005-0003-0003-0003-000000000005',
    'a0000003-0003-0003-0003-000000000003',
    'pendiente',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '1 day'
  ),
  -- Reunión para Solicitud 4 (Saga) - Realizada
  (
    'r0000006-0004-0004-0004-000000000006',
    'a0000004-0004-0004-0004-000000000004',
    'realizada',
    NOW() - INTERVAL '18 days',
    NOW() - INTERVAL '18 days'
  ),
  -- Reuniones para Solicitud 5 (Alicorp)
  (
    'r0000007-0005-0005-0005-000000000007',
    'a0000005-0005-0005-0005-000000000005',
    'realizada',
    NOW() - INTERVAL '40 days',
    NOW() - INTERVAL '40 days'
  ),
  (
    'r0000008-0005-0005-0005-000000000008',
    'a0000005-0005-0005-0005-000000000005',
    'realizada',
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '30 days'
  ),
  -- Reunión cancelada para Solicitud 6
  (
    'r0000009-0006-0006-0006-000000000009',
    'a0000006-0006-0006-0006-000000000006',
    'cancelada',
    NOW() - INTERVAL '55 days',
    NOW() - INTERVAL '55 days'
  );

SELECT COUNT(*) as "Total Reuniones Insertadas" FROM reuniones;

-- ============================================================
-- PASO 5: TIPOS DE DOCUMENTO (Sin dependencias)
-- ============================================================
\echo '======================================'
\echo 'PASO 5: Insertando Tipos de Documento'
\echo '======================================'

INSERT INTO tipo_documento (id, nombre, descripcion, created_at, updated_at)
VALUES 
  (
    't0000001-0001-0001-0001-000000000001',
    'Carta de Presentación',
    'Carta oficial de presentación del alumno ante la empresa',
    NOW(),
    NOW()
  ),
  (
    't0000002-0002-0002-0002-000000000002',
    'Plan de Prácticas',
    'Documento que detalla las actividades a realizar durante las PPP',
    NOW(),
    NOW()
  ),
  (
    't0000003-0003-0003-0003-000000000003',
    'Constancia de Prácticas',
    'Certificado emitido por la empresa al finalizar las prácticas',
    NOW(),
    NOW()
  ),
  (
    't0000004-0004-0004-0004-000000000004',
    'Informe de Prácticas',
    'Documento final elaborado por el estudiante',
    NOW(),
    NOW()
  ),
  (
    't0000005-0005-0005-0005-000000000005',
    'Convenio PPP',
    'Acuerdo formal entre universidad y empresa',
    NOW(),
    NOW()
  ),
  (
    't0000006-0006-0006-0006-000000000006',
    'Certificado Académico',
    'Documento que acredita el rendimiento académico',
    NOW(),
    NOW()
  );

SELECT COUNT(*) as "Total Tipos de Documento Insertados" FROM tipo_documento;

-- ============================================================
-- PASO 6: DOCUMENTOS (FK: id_tipodocumento, id_solicitud_ppp)
-- ============================================================
\echo '======================================'
\echo 'PASO 6: Insertando Documentos'
\echo '======================================'

INSERT INTO documento (id, id_tipodocumento, id_solicitud_ppp, nombre_archivo, ruta_archivo, subido_por, generado_por, created_at, updated_at)
VALUES 
  -- Documentos para Solicitud 1 (BCP)
  (
    'd0000001-0001-0001-0001-000000000001',
    't0000001-0001-0001-0001-000000000001', -- Carta Presentación
    'a0000001-0001-0001-0001-000000000001',
    'carta_presentacion_bcp_2025.pdf',
    'https://storage.azure.com/docs/solicitud1/carta_presentacion.pdf',
    'alu00001-0001-0001-0001-000000000001',
    NULL,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
  ),
  (
    'd0000002-0001-0001-0001-000000000002',
    't0000002-0002-0002-0002-000000000002', -- Plan de Prácticas
    'a0000001-0001-0001-0001-000000000001',
    'plan_practicas_desarrollo_software.pdf',
    'https://storage.azure.com/docs/solicitud1/plan_practicas.pdf',
    'sup00001-0001-0001-0001-000000000001',
    'sup00001-0001-0001-0001-000000000001',
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '8 days'
  ),
  -- Documentos para Solicitud 2 (Rextie)
  (
    'd0000003-0002-0002-0002-000000000003',
    't0000001-0001-0001-0001-000000000001',
    'a0000002-0002-0002-0002-000000000002',
    'carta_presentacion_rextie.pdf',
    'https://storage.azure.com/docs/solicitud2/carta_presentacion.pdf',
    'alu00002-0002-0002-0002-000000000002',
    NULL,
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '25 days'
  ),
  (
    'd0000004-0002-0002-0002-000000000004',
    't0000002-0002-0002-0002-000000000002',
    'a0000002-0002-0002-0002-000000000002',
    'plan_practicas_analisis_datos.pdf',
    'https://storage.azure.com/docs/solicitud2/plan_practicas.pdf',
    'sup00001-0001-0001-0001-000000000001',
    'sup00001-0001-0001-0001-000000000001',
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '20 days'
  ),
  (
    'd0000005-0002-0002-0002-000000000005',
    't0000003-0003-0003-0003-000000000003', -- Constancia
    'a0000002-0002-0002-0002-000000000002',
    'constancia_rextie_completada.pdf',
    'https://storage.azure.com/docs/solicitud2/constancia.pdf',
    NULL,
    NULL,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
  ),
  -- Documentos para Solicitud 3 (Interbank)
  (
    'd0000006-0003-0003-0003-000000000006',
    't0000001-0001-0001-0001-000000000001',
    'a0000003-0003-0003-0003-000000000003',
    'carta_presentacion_interbank.pdf',
    'https://storage.azure.com/docs/solicitud3/carta_presentacion.pdf',
    'alu00003-0003-0003-0003-000000000003',
    NULL,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
  ),
  (
    'd0000007-0003-0003-0003-000000000007',
    't0000006-0006-0006-0006-000000000006', -- Certificado Académico
    'a0000003-0003-0003-0003-000000000003',
    'certificado_academico_alumno3.pdf',
    'https://storage.azure.com/docs/solicitud3/certificado_academico.pdf',
    'alu00003-0003-0003-0003-000000000003',
    NULL,
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '4 days'
  ),
  -- Documentos para Solicitud 4 (Saga)
  (
    'd0000008-0004-0004-0004-000000000008',
    't0000001-0001-0001-0001-000000000001',
    'a0000004-0004-0004-0004-000000000004',
    'carta_presentacion_saga.pdf',
    'https://storage.azure.com/docs/solicitud4/carta_presentacion.pdf',
    'alu00004-0004-0004-0004-000000000004',
    NULL,
    NOW() - INTERVAL '18 days',
    NOW() - INTERVAL '18 days'
  ),
  -- Documentos para Solicitud 5 (Alicorp)
  (
    'd0000009-0005-0005-0005-000000000009',
    't0000001-0001-0001-0001-000000000001',
    'a0000005-0005-0005-0005-000000000005',
    'carta_presentacion_alicorp.pdf',
    'https://storage.azure.com/docs/solicitud5/carta_presentacion.pdf',
    'alu00005-0005-0005-0005-000000000005',
    NULL,
    NOW() - INTERVAL '40 days',
    NOW() - INTERVAL '40 days'
  ),
  (
    'd0000010-0005-0005-0005-000000000010',
    't0000002-0002-0002-0002-000000000002',
    'a0000005-0005-0005-0005-000000000005',
    'plan_practicas_logistica.pdf',
    'https://storage.azure.com/docs/solicitud5/plan_practicas.pdf',
    'sup00003-0003-0003-0003-000000000003',
    'sup00003-0003-0003-0003-000000000003',
    NOW() - INTERVAL '35 days',
    NOW() - INTERVAL '35 days'
  ),
  (
    'd0000011-0005-0005-0005-000000000011',
    't0000003-0003-0003-0003-000000000003',
    'a0000005-0005-0005-0005-000000000005',
    'constancia_alicorp.pdf',
    'https://storage.azure.com/docs/solicitud5/constancia.pdf',
    NULL,
    NULL,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '20 days'
  ),
  (
    'd0000012-0005-0005-0005-000000000012',
    't0000004-0004-0004-0004-000000000004', -- Informe Final
    'a0000005-0005-0005-0005-000000000005',
    'informe_final_practicas_alicorp.pdf',
    'https://storage.azure.com/docs/solicitud5/informe_final.pdf',
    'alu00005-0005-0005-0005-000000000005',
    NULL,
    NOW() - INTERVAL '18 days',
    NOW() - INTERVAL '18 days'
  );

SELECT COUNT(*) as "Total Documentos Insertados" FROM documento;

-- ============================================================
-- RESUMEN FINAL BASE DE DATOS COMPAÑÍAS
-- ============================================================
\echo ''
\echo '======================================'
\echo 'RESUMEN BASE DE DATOS COMPAÑÍAS'
\echo '======================================'

SELECT 
  'empresa' as tabla,
  COUNT(*) as total
FROM empresa
UNION ALL
SELECT 'solicitud_ppp', COUNT(*) FROM solicitud_ppp
UNION ALL
SELECT 'carta_presentacion', COUNT(*) FROM carta_presentacion
UNION ALL
SELECT 'reuniones', COUNT(*) FROM reuniones
UNION ALL
SELECT 'tipo_documento', COUNT(*) FROM tipo_documento
UNION ALL
SELECT 'documento', COUNT(*) FROM documento;

\echo ''
\echo '======================================'
\echo 'DATOS POR ESTADO'
\echo '======================================'

SELECT 
  'Solicitudes por Estado' as categoria,
  estado,
  COUNT(*) as total
FROM solicitud_ppp
GROUP BY estado
UNION ALL
SELECT 
  'Cartas por Estado',
  estado::text,
  COUNT(*)
FROM carta_presentacion
GROUP BY estado
UNION ALL
SELECT 
  'Reuniones por Estado',
  estado::text,
  COUNT(*)
FROM reuniones
GROUP BY estado
ORDER BY categoria, estado;
