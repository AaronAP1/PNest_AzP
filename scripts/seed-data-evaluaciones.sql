-- ============================================================
-- SCRIPT DE DATOS REALES PARA BD EVALUACIONES
-- ============================================================
-- ORDEN: Siguiendo dependencias
-- Ejecutar DESPUÉS de seed-data-real.sql
-- ============================================================

-- ============================================================
-- PASO 7: PREGUNTAS PARA EVALUACIÓN SUPERVISOR (Sin dependencias)
-- ============================================================
\echo '======================================'
\echo 'PASO 7: Insertando Preguntas de Evaluación Supervisor'
\echo '======================================'

INSERT INTO preguntas (id, preguntas, estado, created_at, updated_at)
VALUES 
  (
    'p0000001-0001-0001-0001-000000000001',
    '¿El practicante demuestra puntualidad y responsabilidad en sus actividades?',
    true,
    NOW(),
    NOW()
  ),
  (
    'p0000002-0002-0002-0002-000000000002',
    '¿El practicante muestra iniciativa y proactividad en la resolución de problemas?',
    true,
    NOW(),
    NOW()
  ),
  (
    'p0000003-0003-0003-0003-000000000003',
    '¿El practicante trabaja efectivamente en equipo y se comunica adecuadamente?',
    true,
    NOW(),
    NOW()
  ),
  (
    'p0000004-0004-0004-0004-000000000004',
    '¿El practicante aplica los conocimientos teóricos a situaciones prácticas?',
    true,
    NOW(),
    NOW()
  ),
  (
    'p0000005-0005-0005-0005-000000000005',
    '¿El practicante cumple con los objetivos y metas establecidas en su plan de prácticas?',
    true,
    NOW(),
    NOW()
  ),
  (
    'p0000006-0006-0006-0006-000000000006',
    '¿El practicante demuestra capacidad de adaptación a diferentes situaciones laborales?',
    true,
    NOW(),
    NOW()
  ),
  (
    'p0000007-0007-0007-0007-000000000007',
    '¿El practicante muestra interés por aprender y desarrollar nuevas competencias?',
    true,
    NOW(),
    NOW()
  ),
  (
    'p0000008-0008-0008-0008-000000000008',
    '¿El practicante mantiene una actitud profesional y ética en su desempeño?',
    true,
    NOW(),
    NOW()
  );

SELECT COUNT(*) as "Total Preguntas Insertadas" FROM preguntas;

-- ============================================================
-- PASO 8: DIMENSIONES TRANSVERSALES (Sin dependencias)
-- ============================================================
\echo '======================================'
\echo 'PASO 8: Insertando Dimensiones Transversales'
\echo '======================================'

INSERT INTO dimension_transversal (id, pregunta, estado, created_at, updated_at)
VALUES 
  (
    'dt000001-0001-0001-0001-000000000001',
    'Capacidad de comunicación efectiva (oral y escrita)',
    true,
    NOW(),
    NOW()
  ),
  (
    'dt000002-0002-0002-0002-000000000002',
    'Trabajo en equipo y colaboración interdisciplinaria',
    true,
    NOW(),
    NOW()
  ),
  (
    'dt000003-0003-0003-0003-000000000003',
    'Liderazgo y gestión de proyectos',
    true,
    NOW(),
    NOW()
  ),
  (
    'dt000004-0004-0004-0004-000000000004',
    'Pensamiento crítico y resolución de problemas',
    true,
    NOW(),
    NOW()
  ),
  (
    'dt000005-0005-0005-0005-000000000005',
    'Ética profesional y responsabilidad social',
    true,
    NOW(),
    NOW()
  ),
  (
    'dt000006-0006-0006-0006-000000000006',
    'Adaptabilidad y gestión del cambio',
    true,
    NOW(),
    NOW()
  ),
  (
    'dt000007-0007-0007-0007-000000000007',
    'Creatividad e innovación',
    true,
    NOW(),
    NOW()
  ),
  (
    'dt000008-0008-0008-0008-000000000008',
    'Manejo de tecnologías de información',
    true,
    NOW(),
    NOW()
  );

SELECT COUNT(*) as "Total Dimensiones Transversales Insertadas" FROM dimension_transversal;

-- ============================================================
-- PASO 9: EVALUACIONES DE SUPERVISOR (Sin FK locales)
-- ============================================================
\echo '======================================'
\echo 'PASO 9: Insertando Evaluaciones de Supervisor'
\echo '======================================'

INSERT INTO evaluacion_supervisor (id, id_supervisor, id_alumno, comentario, estado, created_at, updated_at)
VALUES 
  -- Evaluación 1: Supervisor 1 evalúa Alumno 1 (BCP)
  (
    'es000001-0001-0001-0001-000000000001',
    'sup00001-0001-0001-0001-000000000001',
    'alu00001-0001-0001-0001-000000000001',
    'Excelente desempeño en el área de desarrollo. Muestra gran capacidad técnica y trabajo en equipo.',
    true,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
  ),
  -- Evaluación 2: Supervisor 1 evalúa Alumno 2 (Rextie)
  (
    'es000002-0002-0002-0002-000000000002',
    'sup00001-0001-0001-0001-000000000001',
    'alu00002-0002-0002-0002-000000000002',
    'Muy buen análisis de datos. Cumplió todos los objetivos propuestos en el plan de prácticas.',
    true,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
  ),
  -- Evaluación 3: Supervisor 2 evalúa Alumno 4 (Saga)
  (
    'es000003-0004-0004-0004-000000000004',
    'sup00002-0002-0002-0002-000000000002',
    'alu00004-0004-0004-0004-000000000004',
    'Buen desempeño en marketing digital. Propuso estrategias creativas e innovadoras.',
    true,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
  ),
  -- Evaluación 4: Supervisor 3 evalúa Alumno 5 (Alicorp)
  (
    'es000004-0005-0005-0005-000000000005',
    'sup00003-0003-0003-0003-000000000003',
    'alu00005-0005-0005-0005-000000000005',
    'Destacado en logística. Implementó mejoras en los procesos de la cadena de suministro.',
    true,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '20 days'
  );

SELECT COUNT(*) as "Total Evaluaciones Supervisor Insertadas" FROM evaluacion_supervisor;

-- ============================================================
-- PASO 10: EVALUACIÓN PREGUNTAS (FK: id_evaluacion, id_pregunta)
-- ============================================================
\echo '======================================'
\echo 'PASO 10: Insertando Respuestas a Preguntas de Evaluación'
\echo '======================================'

-- Respuestas para Evaluación 1 (Alumno 1 - BCP)
INSERT INTO evaluacion_preguntas (id, id_evaluacion, id_pregunta, valor, estado, created_at, updated_at)
VALUES 
  ('ep000001-0001-0001-0001-000000000001', 'es000001-0001-0001-0001-000000000001', 'p0000001-0001-0001-0001-000000000001', 'Excelente', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('ep000002-0001-0001-0001-000000000002', 'es000001-0001-0001-0001-000000000001', 'p0000002-0002-0002-0002-000000000002', 'Excelente', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('ep000003-0001-0001-0001-000000000003', 'es000001-0001-0001-0001-000000000001', 'p0000003-0003-0003-0003-000000000003', 'Muy Bueno', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('ep000004-0001-0001-0001-000000000004', 'es000001-0001-0001-0001-000000000001', 'p0000004-0004-0004-0004-000000000004', 'Excelente', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('ep000005-0001-0001-0001-000000000005', 'es000001-0001-0001-0001-000000000001', 'p0000005-0005-0005-0005-000000000005', 'Muy Bueno', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('ep000006-0001-0001-0001-000000000006', 'es000001-0001-0001-0001-000000000001', 'p0000006-0006-0006-0006-000000000006', 'Excelente', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('ep000007-0001-0001-0001-000000000007', 'es000001-0001-0001-0001-000000000001', 'p0000007-0007-0007-0007-000000000007', 'Excelente', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('ep000008-0001-0001-0001-000000000008', 'es000001-0001-0001-0001-000000000001', 'p0000008-0008-0008-0008-000000000008', 'Excelente', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days');

-- Respuestas para Evaluación 2 (Alumno 2 - Rextie)
INSERT INTO evaluacion_preguntas (id, id_evaluacion, id_pregunta, valor, estado, created_at, updated_at)
VALUES 
  ('ep000009-0002-0002-0002-000000000009', 'es000002-0002-0002-0002-000000000002', 'p0000001-0001-0001-0001-000000000001', 'Muy Bueno', true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  ('ep000010-0002-0002-0002-000000000010', 'es000002-0002-0002-0002-000000000002', 'p0000002-0002-0002-0002-000000000002', 'Excelente', true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  ('ep000011-0002-0002-0002-000000000011', 'es000002-0002-0002-0002-000000000002', 'p0000003-0003-0003-0003-000000000003', 'Muy Bueno', true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  ('ep000012-0002-0002-0002-000000000012', 'es000002-0002-0002-0002-000000000002', 'p0000004-0004-0004-0004-000000000004', 'Excelente', true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  ('ep000013-0002-0002-0002-000000000013', 'es000002-0002-0002-0002-000000000002', 'p0000005-0005-0005-0005-000000000005', 'Excelente', true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  ('ep000014-0002-0002-0002-000000000014', 'es000002-0002-0002-0002-000000000002', 'p0000006-0006-0006-0006-000000000006', 'Muy Bueno', true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  ('ep000015-0002-0002-0002-000000000015', 'es000002-0002-0002-0002-000000000002', 'p0000007-0007-0007-0007-000000000007', 'Excelente', true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  ('ep000016-0002-0002-0002-000000000016', 'es000002-0002-0002-0002-000000000002', 'p0000008-0008-0008-0008-000000000008', 'Muy Bueno', true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days');

-- Respuestas para Evaluación 3 (Alumno 4 - Saga)
INSERT INTO evaluacion_preguntas (id, id_evaluacion, id_pregunta, valor, estado, created_at, updated_at)
VALUES 
  ('ep000017-0004-0004-0004-000000000017', 'es000003-0004-0004-0004-000000000004', 'p0000001-0001-0001-0001-000000000001', 'Muy Bueno', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('ep000018-0004-0004-0004-000000000018', 'es000003-0004-0004-0004-000000000004', 'p0000002-0002-0002-0002-000000000002', 'Excelente', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('ep000019-0004-0004-0004-000000000019', 'es000003-0004-0004-0004-000000000004', 'p0000003-0003-0003-0003-000000000003', 'Bueno', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('ep000020-0004-0004-0004-000000000020', 'es000003-0004-0004-0004-000000000004', 'p0000004-0004-0004-0004-000000000004', 'Muy Bueno', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('ep000021-0004-0004-0004-000000000021', 'es000003-0004-0004-0004-000000000004', 'p0000005-0005-0005-0005-000000000005', 'Muy Bueno', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('ep000022-0004-0004-0004-000000000022', 'es000003-0004-0004-0004-000000000004', 'p0000006-0006-0006-0006-000000000006', 'Muy Bueno', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('ep000023-0004-0004-0004-000000000023', 'es000003-0004-0004-0004-000000000004', 'p0000007-0007-0007-0007-000000000007', 'Excelente', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('ep000024-0004-0004-0004-000000000024', 'es000003-0004-0004-0004-000000000004', 'p0000008-0008-0008-0008-000000000008', 'Muy Bueno', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days');

-- Respuestas para Evaluación 4 (Alumno 5 - Alicorp)
INSERT INTO evaluacion_preguntas (id, id_evaluacion, id_pregunta, valor, estado, created_at, updated_at)
VALUES 
  ('ep000025-0005-0005-0005-000000000025', 'es000004-0005-0005-0005-000000000005', 'p0000001-0001-0001-0001-000000000001', 'Excelente', true, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
  ('ep000026-0005-0005-0005-000000000026', 'es000004-0005-0005-0005-000000000005', 'p0000002-0002-0002-0002-000000000002', 'Excelente', true, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
  ('ep000027-0005-0005-0005-000000000027', 'es000004-0005-0005-0005-000000000005', 'p0000003-0003-0003-0003-000000000003', 'Excelente', true, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
  ('ep000028-0005-0005-0005-000000000028', 'es000004-0005-0005-0005-000000000005', 'p0000004-0004-0004-0004-000000000004', 'Muy Bueno', true, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
  ('ep000029-0005-0005-0005-000000000029', 'es000004-0005-0005-0005-000000000005', 'p0000005-0005-0005-0005-000000000005', 'Excelente', true, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
  ('ep000030-0005-0005-0005-000000000030', 'es000004-0005-0005-0005-000000000005', 'p0000006-0006-0006-0006-000000000006', 'Excelente', true, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
  ('ep000031-0005-0005-0005-000000000031', 'es000004-0005-0005-0005-000000000005', 'p0000007-0007-0007-0007-000000000007', 'Muy Bueno', true, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
  ('ep000032-0005-0005-0005-000000000032', 'es000004-0005-0005-0005-000000000005', 'p0000008-0008-0008-0008-000000000008', 'Excelente', true, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days');

SELECT COUNT(*) as "Total Respuestas de Evaluación Insertadas" FROM evaluacion_preguntas;

-- ============================================================
-- PASO 11: EVALUACIONES DE PRACTICANTE (Sin FK locales)
-- ============================================================
\echo '======================================'
\echo 'PASO 11: Insertando Evaluaciones de Practicante'
\echo '======================================'

INSERT INTO evaluacion_practicante (id, id_solicitud, comentario, estado, created_at, updated_at)
VALUES 
  -- Evaluación Practicante 1: Solicitud 1 (BCP)
  (
    'epr00001-0001-0001-0001-000000000001',
    'a0000001-0001-0001-0001-000000000001',
    'La experiencia en BCP fue excepcional. Aprendí tecnologías modernas y metodologías ágiles.',
    true,
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '4 days'
  ),
  -- Evaluación Practicante 2: Solicitud 2 (Rextie)
  (
    'epr00002-0002-0002-0002-000000000002',
    'a0000002-0002-0002-0002-000000000002',
    'Excelente ambiente laboral en Rextie. Pude aplicar conocimientos de ciencia de datos en proyectos reales.',
    true,
    NOW() - INTERVAL '9 days',
    NOW() - INTERVAL '9 days'
  ),
  -- Evaluación Practicante 3: Solicitud 4 (Saga)
  (
    'epr00003-0004-0004-0004-000000000004',
    'a0000004-0004-0004-0004-000000000004',
    'Buena experiencia en Saga Falabella. Desarrollé competencias en marketing digital y estrategia comercial.',
    true,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  -- Evaluación Practicante 4: Solicitud 5 (Alicorp)
  (
    'epr00004-0005-0005-0005-000000000005',
    'a0000005-0005-0005-0005-000000000005',
    'Experiencia muy enriquecedora en Alicorp. Participé en proyectos de optimización de la cadena logística.',
    true,
    NOW() - INTERVAL '19 days',
    NOW() - INTERVAL '19 days'
  );

SELECT COUNT(*) as "Total Evaluaciones Practicante Insertadas" FROM evaluacion_practicante;

-- ============================================================
-- PASO 12: PREGUNTAS LÍNEA (FK: id_evaluacion_practicante)
-- ============================================================
\echo '======================================'
\echo 'PASO 12: Insertando Preguntas Línea de Carrera'
\echo '======================================'

INSERT INTO preguntas_linea (id, id_linea_facultad, id_evaluacion_practicante, preguntas, estado, created_at, updated_at)
VALUES 
  -- Preguntas para Evaluación Practicante 1 (Ingeniería de Software)
  (
    'pl000001-0001-0001-0001-000000000001',
    'linea001-0001-0001-0001-000000000001', -- ID de línea en academic-service (Ingeniería Software)
    'epr00001-0001-0001-0001-000000000001',
    '¿Aplicaste principios de arquitectura de software en el proyecto?',
    true,
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '4 days'
  ),
  (
    'pl000002-0001-0001-0001-000000000002',
    'linea001-0001-0001-0001-000000000001',
    'epr00001-0001-0001-0001-000000000001',
    '¿Utilizaste metodologías ágiles (Scrum, Kanban) en el desarrollo?',
    true,
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '4 days'
  ),
  (
    'pl000003-0001-0001-0001-000000000003',
    'linea001-0001-0001-0001-000000000001',
    'epr00001-0001-0001-0001-000000000001',
    '¿Implementaste pruebas unitarias y de integración?',
    true,
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '4 days'
  ),
  -- Preguntas para Evaluación Practicante 2 (Ciencia de Datos)
  (
    'pl000004-0002-0002-0002-000000000004',
    'linea002-0002-0002-0002-000000000002', -- Ciencia de Datos
    'epr00002-0002-0002-0002-000000000002',
    '¿Realizaste análisis exploratorio de datos (EDA)?',
    true,
    NOW() - INTERVAL '9 days',
    NOW() - INTERVAL '9 days'
  ),
  (
    'pl000005-0002-0002-0002-000000000005',
    'linea002-0002-0002-0002-000000000002',
    'epr00002-0002-0002-0002-000000000002',
    '¿Aplicaste técnicas de machine learning en proyectos reales?',
    true,
    NOW() - INTERVAL '9 days',
    NOW() - INTERVAL '9 days'
  ),
  (
    'pl000006-0002-0002-0002-000000000006',
    'linea002-0002-0002-0002-000000000002',
    'epr00002-0002-0002-0002-000000000002',
    '¿Creaste dashboards y visualizaciones de datos?',
    true,
    NOW() - INTERVAL '9 days',
    NOW() - INTERVAL '9 days'
  ),
  -- Preguntas para Evaluación Practicante 3 (Marketing)
  (
    'pl000007-0004-0004-0004-000000000007',
    'linea003-0003-0003-0003-000000000003', -- Marketing
    'epr00003-0004-0004-0004-000000000004',
    '¿Participaste en la creación de estrategias de marketing digital?',
    true,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  (
    'pl000008-0004-0004-0004-000000000008',
    'linea003-0003-0003-0003-000000000003',
    'epr00003-0004-0004-0004-000000000004',
    '¿Gestionaste campañas en redes sociales y medios digitales?',
    true,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  (
    'pl000009-0004-0004-0004-000000000009',
    'linea003-0003-0003-0003-000000000003',
    'epr00003-0004-0004-0004-000000000004',
    '¿Analizaste métricas y KPIs de desempeño de campañas?',
    true,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  -- Preguntas para Evaluación Practicante 4 (Logística)
  (
    'pl000010-0005-0005-0005-000000000010',
    'linea004-0004-0004-0004-000000000004', -- Logística
    'epr00004-0005-0005-0005-000000000005',
    '¿Participaste en la optimización de procesos logísticos?',
    true,
    NOW() - INTERVAL '19 days',
    NOW() - INTERVAL '19 days'
  ),
  (
    'pl000011-0005-0005-0005-000000000011',
    'linea004-0004-0004-0004-000000000004',
    'epr00004-0005-0005-0005-000000000005',
    '¿Utilizaste sistemas de gestión de inventarios (WMS)?',
    true,
    NOW() - INTERVAL '19 days',
    NOW() - INTERVAL '19 days'
  ),
  (
    'pl000012-0005-0005-0005-000000000012',
    'linea004-0004-0004-0004-000000000004',
    'epr00004-0005-0005-0005-000000000005',
    '¿Analizaste indicadores de desempeño de la cadena de suministro?',
    true,
    NOW() - INTERVAL '19 days',
    NOW() - INTERVAL '19 days'
  );

SELECT COUNT(*) as "Total Preguntas Línea Insertadas" FROM preguntas_linea;

-- ============================================================
-- PASO 13: EVALUACIÓN PRACTICANTE SOLICITUD (Dimensiones Transversales)
-- ============================================================
\echo '======================================'
\echo 'PASO 13: Insertando Evaluaciones de Dimensiones Transversales'
\echo '======================================'

-- Evaluaciones Dimensiones Transversales para Evaluación Practicante 1 (BCP)
INSERT INTO evaluacion_practicante_solicitud (id, id_dimension_transversal, id_evaluacion_practicante, valor, created_at, updated_at)
VALUES 
  ('eps00001-0001-0001-0001-000000000001', 'dt000001-0001-0001-0001-000000000001', 'epr00001-0001-0001-0001-000000000001', 'Excelente', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  ('eps00002-0001-0001-0001-000000000002', 'dt000002-0002-0002-0002-000000000002', 'epr00001-0001-0001-0001-000000000001', 'Excelente', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  ('eps00003-0001-0001-0001-000000000003', 'dt000003-0003-0003-0003-000000000003', 'epr00001-0001-0001-0001-000000000001', 'Muy Bueno', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  ('eps00004-0001-0001-0001-000000000004', 'dt000004-0004-0004-0004-000000000004', 'epr00001-0001-0001-0001-000000000001', 'Excelente', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  ('eps00005-0001-0001-0001-000000000005', 'dt000005-0005-0005-0005-000000000005', 'epr00001-0001-0001-0001-000000000001', 'Excelente', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  ('eps00006-0001-0001-0001-000000000006', 'dt000006-0006-0006-0006-000000000006', 'epr00001-0001-0001-0001-000000000001', 'Muy Bueno', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  ('eps00007-0001-0001-0001-000000000007', 'dt000007-0007-0007-0007-000000000007', 'epr00001-0001-0001-0001-000000000001', 'Excelente', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  ('eps00008-0001-0001-0001-000000000008', 'dt000008-0008-0008-0008-000000000008', 'epr00001-0001-0001-0001-000000000001', 'Excelente', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days');

-- Evaluaciones Dimensiones Transversales para Evaluación Practicante 2 (Rextie)
INSERT INTO evaluacion_practicante_solicitud (id, id_dimension_transversal, id_evaluacion_practicante, valor, created_at, updated_at)
VALUES 
  ('eps00009-0002-0002-0002-000000000009', 'dt000001-0001-0001-0001-000000000001', 'epr00002-0002-0002-0002-000000000002', 'Muy Bueno', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
  ('eps00010-0002-0002-0002-000000000010', 'dt000002-0002-0002-0002-000000000002', 'epr00002-0002-0002-0002-000000000002', 'Excelente', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
  ('eps00011-0002-0002-0002-000000000011', 'dt000003-0003-0003-0003-000000000003', 'epr00002-0002-0002-0002-000000000002', 'Bueno', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
  ('eps00012-0002-0002-0002-000000000012', 'dt000004-0004-0004-0004-000000000004', 'epr00002-0002-0002-0002-000000000002', 'Excelente', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
  ('eps00013-0002-0002-0002-000000000013', 'dt000005-0005-0005-0005-000000000005', 'epr00002-0002-0002-0002-000000000002', 'Muy Bueno', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
  ('eps00014-0002-0002-0002-000000000014', 'dt000006-0006-0006-0006-000000000006', 'epr00002-0002-0002-0002-000000000002', 'Excelente', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
  ('eps00015-0002-0002-0002-000000000015', 'dt000007-0007-0007-0007-000000000007', 'epr00002-0002-0002-0002-000000000002', 'Muy Bueno', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
  ('eps00016-0002-0002-0002-000000000016', 'dt000008-0008-0008-0008-000000000008', 'epr00002-0002-0002-0002-000000000002', 'Excelente', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days');

-- Evaluaciones Dimensiones Transversales para Evaluación Practicante 3 (Saga)
INSERT INTO evaluacion_practicante_solicitud (id, id_dimension_transversal, id_evaluacion_practicante, valor, created_at, updated_at)
VALUES 
  ('eps00017-0004-0004-0004-000000000017', 'dt000001-0001-0001-0001-000000000001', 'epr00003-0004-0004-0004-000000000004', 'Excelente', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('eps00018-0004-0004-0004-000000000018', 'dt000002-0002-0002-0002-000000000002', 'epr00003-0004-0004-0004-000000000004', 'Muy Bueno', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('eps00019-0004-0004-0004-000000000019', 'dt000003-0003-0003-0003-000000000003', 'epr00003-0004-0004-0004-000000000004', 'Muy Bueno', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('eps00020-0004-0004-0004-000000000020', 'dt000004-0004-0004-0004-000000000004', 'epr00003-0004-0004-0004-000000000004', 'Muy Bueno', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('eps00021-0004-0004-0004-000000000021', 'dt000005-0005-0005-0005-000000000005', 'epr00003-0004-0004-0004-000000000004', 'Excelente', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('eps00022-0004-0004-0004-000000000022', 'dt000006-0006-0006-0006-000000000006', 'epr00003-0004-0004-0004-000000000004', 'Muy Bueno', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('eps00023-0004-0004-0004-000000000023', 'dt000007-0007-0007-0007-000000000007', 'epr00003-0004-0004-0004-000000000004', 'Excelente', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('eps00024-0004-0004-0004-000000000024', 'dt000008-0008-0008-0008-000000000008', 'epr00003-0004-0004-0004-000000000004', 'Bueno', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- Evaluaciones Dimensiones Transversales para Evaluación Practicante 4 (Alicorp)
INSERT INTO evaluacion_practicante_solicitud (id, id_dimension_transversal, id_evaluacion_practicante, valor, created_at, updated_at)
VALUES 
  ('eps00025-0005-0005-0005-000000000025', 'dt000001-0001-0001-0001-000000000001', 'epr00004-0005-0005-0005-000000000005', 'Excelente', NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
  ('eps00026-0005-0005-0005-000000000026', 'dt000002-0002-0002-0002-000000000002', 'epr00004-0005-0005-0005-000000000005', 'Excelente', NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
  ('eps00027-0005-0005-0005-000000000027', 'dt000003-0003-0003-0003-000000000003', 'epr00004-0005-0005-0005-000000000005', 'Excelente', NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
  ('eps00028-0005-0005-0005-000000000028', 'dt000004-0004-0004-0004-000000000004', 'epr00004-0005-0005-0005-000000000005', 'Excelente', NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
  ('eps00029-0005-0005-0005-000000000029', 'dt000005-0005-0005-0005-000000000005', 'epr00004-0005-0005-0005-000000000005', 'Muy Bueno', NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
  ('eps00030-0005-0005-0005-000000000030', 'dt000006-0006-0006-0006-000000000006', 'epr00004-0005-0005-0005-000000000005', 'Excelente', NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
  ('eps00031-0005-0005-0005-000000000031', 'dt000007-0007-0007-0007-000000000007', 'epr00004-0005-0005-0005-000000000005', 'Muy Bueno', NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
  ('eps00032-0005-0005-0005-000000000032', 'dt000008-0008-0008-0008-000000000008', 'epr00004-0005-0005-0005-000000000005', 'Excelente', NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days');

SELECT COUNT(*) as "Total Evaluaciones Dimensiones Transversales Insertadas" FROM evaluacion_practicante_solicitud;

-- ============================================================
-- RESUMEN FINAL BASE DE DATOS EVALUACIONES
-- ============================================================
\echo ''
\echo '======================================'
\echo 'RESUMEN BASE DE DATOS EVALUACIONES'
\echo '======================================'

SELECT 
  'preguntas' as tabla,
  COUNT(*) as total
FROM preguntas
UNION ALL
SELECT 'dimension_transversal', COUNT(*) FROM dimension_transversal
UNION ALL
SELECT 'evaluacion_supervisor', COUNT(*) FROM evaluacion_supervisor
UNION ALL
SELECT 'evaluacion_preguntas', COUNT(*) FROM evaluacion_preguntas
UNION ALL
SELECT 'evaluacion_practicante', COUNT(*) FROM evaluacion_practicante
UNION ALL
SELECT 'preguntas_linea', COUNT(*) FROM preguntas_linea
UNION ALL
SELECT 'evaluacion_practicante_solicitud', COUNT(*) FROM evaluacion_practicante_solicitud;

\echo ''
\echo '======================================'
\echo 'ESTADÍSTICAS DE EVALUACIONES'
\echo '======================================'

SELECT 
  'Evaluaciones Supervisor Completadas' as metrica,
  COUNT(*) as cantidad
FROM evaluacion_supervisor
WHERE estado = true
UNION ALL
SELECT 
  'Evaluaciones Practicante Completadas',
  COUNT(*)
FROM evaluacion_practicante
WHERE estado = true
UNION ALL
SELECT 
  'Respuestas "Excelente"',
  COUNT(*)
FROM evaluacion_preguntas
WHERE valor = 'Excelente';
