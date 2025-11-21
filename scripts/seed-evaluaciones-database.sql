-- =============================================
-- SCRIPT DE INSERCIÓN DE DATOS DE PRUEBA
-- Base de Datos: pnest_evaluaciones_db
-- Fecha: 2025-11-21
-- =============================================
-- Este script inserta datos de prueba cumpliendo todas las relaciones del schema
-- Orden: 1) Tablas sin dependencias, 2) Tablas con relaciones

-- =============================================
-- PASO 1: LIMPIAR DATOS EXISTENTES (OPCIONAL)
-- =============================================
-- DESCOMENTAR SI QUIERES LIMPIAR TODO ANTES DE INSERTAR
-- TRUNCATE TABLE evaluacion_practicante_solicitud CASCADE;
-- TRUNCATE TABLE evaluacion_preguntas CASCADE;
-- TRUNCATE TABLE preguntas_linea CASCADE;
-- TRUNCATE TABLE evaluacion_practicante CASCADE;
-- TRUNCATE TABLE evaluacion_supervisor CASCADE;
-- TRUNCATE TABLE dimension_transversal CASCADE;
-- TRUNCATE TABLE preguntas CASCADE;

-- =============================================
-- PASO 2: TABLAS SIN DEPENDENCIAS
-- =============================================

-- ============================================
-- TABLA: dimension_transversal (NO tiene dependencias)
-- ============================================
INSERT INTO dimension_transversal (id, pregunta, estado, created_at, updated_at) VALUES
('a1111111-1111-1111-1111-111111111111', '¿El practicante demuestra puntualidad en sus actividades?', true, NOW(), NOW()),
('a2222222-2222-2222-2222-222222222222', '¿Muestra iniciativa para resolver problemas de forma autónoma?', true, NOW(), NOW()),
('a3333333-3333-3333-3333-333333333333', '¿Trabaja de manera colaborativa con el equipo?', true, NOW(), NOW()),
('a4444444-4444-4444-4444-444444444444', '¿Presenta una comunicación efectiva y profesional?', true, NOW(), NOW()),
('a5555555-5555-5555-5555-555555555555', '¿Cumple con los estándares de calidad establecidos?', true, NOW(), NOW()),
('a6666666-6666-6666-6666-666666666666', '¿Se adapta rápidamente a nuevos procesos y tecnologías?', true, NOW(), NOW()),
('a7777777-7777-7777-7777-777777777777', '¿Demuestra ética profesional en todas sus acciones?', true, NOW(), NOW()),
('a8888888-8888-8888-8888-888888888888', '¿Participa activamente en las reuniones del equipo?', true, NOW(), NOW()),
('a9999999-9999-9999-9999-999999999999', '¿Aplica conocimientos teóricos en situaciones prácticas?', true, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '¿Busca retroalimentación para mejorar continuamente?', true, NOW(), NOW());

-- ============================================
-- TABLA: preguntas (NO tiene dependencias)
-- ============================================
INSERT INTO preguntas (id, preguntas, estado, created_at, updated_at) VALUES
('b1111111-1111-1111-1111-111111111111', '¿El alumno cumple con las tareas asignadas en el plazo establecido?', true, NOW(), NOW()),
('b2222222-2222-2222-2222-222222222222', '¿Demuestra compromiso con su aprendizaje durante las prácticas?', true, NOW(), NOW()),
('b3333333-3333-3333-3333-333333333333', '¿Respeta las normas y procedimientos de la institución/empresa?', true, NOW(), NOW()),
('b4444444-4444-4444-4444-444444444444', '¿Muestra disposición para aprender de sus errores?', true, NOW(), NOW()),
('b5555555-5555-5555-5555-555555555555', '¿Tiene capacidad de análisis crítico ante situaciones complejas?', true, NOW(), NOW()),
('b6666666-6666-6666-6666-666666666666', '¿Participa activamente en actividades de capacitación?', true, NOW(), NOW()),
('b7777777-7777-7777-7777-777777777777', '¿Demuestra creatividad e innovación en su trabajo?', true, NOW(), NOW()),
('b8888888-8888-8888-8888-888888888888', '¿Mantiene una actitud positiva ante los desafíos?', true, NOW(), NOW()),
('b9999999-9999-9999-9999-999999999999', '¿Es proactivo en la identificación de oportunidades de mejora?', true, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '¿Logra integrar teoría y práctica de manera efectiva?', true, NOW(), NOW());

-- =============================================
-- PASO 3: TABLAS CON DEPENDENCIAS EXTERNAS
-- =============================================
-- NOTA: Estos UUIDs deben existir en otras bases de datos (Auth/Core/Companias)
-- Usamos UUIDs de ejemplo que deberías reemplazar con datos reales

-- ============================================
-- TABLA: evaluacion_supervisor 
-- Depende de: idSupervisor (Auth), idAlumno (Auth)
-- ============================================
INSERT INTO evaluacion_supervisor (id, id_supervisor, id_alumno, comentario, estado, created_at, updated_at) VALUES
('c1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'Excelente desempeño durante el primer mes de prácticas. Demuestra habilidades técnicas sólidas.', true, NOW(), NOW()),
('c2222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', 'Buen rendimiento general. Necesita mejorar la gestión del tiempo.', true, NOW(), NOW()),
('c3333333-3333-3333-3333-333333333333', 'd3333333-3333-3333-3333-333333333333', 'e3333333-3333-3333-3333-333333333333', 'Muy comprometido con sus responsabilidades. Supera las expectativas.', true, NOW(), NOW()),
('c4444444-4444-4444-4444-444444444444', 'd1111111-1111-1111-1111-111111111111', 'e4444444-4444-4444-4444-444444444444', 'Desempeño satisfactorio. Muestra mejora continua en habilidades de comunicación.', true, NOW(), NOW()),
('c5555555-5555-5555-5555-555555555555', 'd2222222-2222-2222-2222-222222222222', 'e5555555-5555-5555-5555-555555555555', 'Requiere mayor proactividad. Cumple con lo mínimo esperado.', true, NOW(), NOW());

-- ============================================
-- TABLA: evaluacion_practicante
-- Depende de: idSolicitud (Companias - solicitudes_ppp)
-- ============================================
INSERT INTO evaluacion_practicante (id, id_solicitud, comentario, estado, created_at, updated_at) VALUES
('f1111111-1111-1111-1111-111111111111', 'g1111111-1111-1111-1111-111111111111', 'El practicante ha desarrollado competencias clave durante su periodo de prácticas.', true, NOW(), NOW()),
('f2222222-2222-2222-2222-222222222222', 'g2222222-2222-2222-2222-222222222222', 'Excelente adaptación al ambiente laboral y a la cultura organizacional.', true, NOW(), NOW()),
('f3333333-3333-3333-3333-333333333333', 'g3333333-3333-3333-3333-333333333333', 'Demuestra dominio de las herramientas técnicas requeridas para el puesto.', true, NOW(), NOW()),
('f4444444-4444-4444-4444-444444444444', 'g4444444-4444-4444-4444-444444444444', 'Necesita reforzar habilidades de liderazgo y toma de decisiones.', true, NOW(), NOW()),
('f5555555-5555-5555-5555-555555555555', 'g5555555-5555-5555-5555-555555555555', 'Cumple con los objetivos planteados en el plan de prácticas.', true, NOW(), NOW());

-- =============================================
-- PASO 4: TABLAS CON DEPENDENCIAS INTERNAS
-- =============================================

-- ============================================
-- TABLA: evaluacion_preguntas
-- Depende de: evaluacion_supervisor (id_evaluacion), preguntas (id_pregunta)
-- ============================================
INSERT INTO evaluacion_preguntas (id, id_evaluacion, id_pregunta, valor, estado, created_at, updated_at) VALUES
-- Evaluación Supervisor 1
('h1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'Excelente', true, NOW(), NOW()),
('h1111112-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222', 'Muy Bueno', true, NOW(), NOW()),

-- Evaluación Supervisor 2
('h2222221-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'b3333333-3333-3333-3333-333333333333', 'Bueno', true, NOW(), NOW()),
('h2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'b4444444-4444-4444-4444-444444444444', 'Muy Bueno', true, NOW(), NOW()),

-- Evaluación Supervisor 3
('h3333331-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', 'b5555555-5555-5555-5555-555555555555', 'Excelente', true, NOW(), NOW()),
('h3333332-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', 'b6666666-6666-6666-6666-666666666666', 'Excelente', true, NOW(), NOW()),

-- Evaluación Supervisor 4
('h4444441-4444-4444-4444-444444444444', 'c4444444-4444-4444-4444-444444444444', 'b7777777-7777-7777-7777-777777777777', 'Bueno', true, NOW(), NOW()),
('h4444442-4444-4444-4444-444444444444', 'c4444444-4444-4444-4444-444444444444', 'b8888888-8888-8888-8888-888888888888', 'Muy Bueno', true, NOW(), NOW()),

-- Evaluación Supervisor 5
('h5555551-5555-5555-5555-555555555555', 'c5555555-5555-5555-5555-555555555555', 'b9999999-9999-9999-9999-999999999999', 'Regular', true, NOW(), NOW()),
('h5555552-5555-5555-5555-555555555555', 'c5555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Bueno', true, NOW(), NOW());

-- ============================================
-- TABLA: preguntas_linea
-- Depende de: evaluacion_practicante (id_evaluacion_practicante), lineas_facultad (id_linea_facultad - externa)
-- ============================================
INSERT INTO preguntas_linea (id, id_linea_facultad, id_evaluacion_practicante, preguntas, estado, created_at, updated_at) VALUES
-- Evaluación Practicante 1
('i1111111-1111-1111-1111-111111111111', 'j1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', '¿Aplica metodologías ágiles en el desarrollo de software?', true, NOW(), NOW()),
('i1111112-1111-1111-1111-111111111111', 'j1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', '¿Utiliza herramientas de control de versiones adecuadamente?', true, NOW(), NOW()),

-- Evaluación Practicante 2
('i2222221-2222-2222-2222-222222222222', 'j2222222-2222-2222-2222-222222222222', 'f2222222-2222-2222-2222-222222222222', '¿Demuestra conocimientos en arquitectura de sistemas?', true, NOW(), NOW()),
('i2222222-2222-2222-2222-222222222222', 'j2222222-2222-2222-2222-222222222222', 'f2222222-2222-2222-2222-222222222222', '¿Implementa buenas prácticas de seguridad informática?', true, NOW(), NOW()),

-- Evaluación Practicante 3
('i3333331-3333-3333-3333-333333333333', 'j3333333-3333-3333-3333-333333333333', 'f3333333-3333-3333-3333-333333333333', '¿Realiza análisis de datos de manera efectiva?', true, NOW(), NOW()),
('i3333332-3333-3333-3333-333333333333', 'j3333333-3333-3333-3333-333333333333', 'f3333333-3333-3333-3333-333333333333', '¿Interpreta correctamente los resultados estadísticos?', true, NOW(), NOW()),

-- Evaluación Practicante 4
('i4444441-4444-4444-4444-444444444444', 'j4444444-4444-4444-4444-444444444444', 'f4444444-4444-4444-4444-444444444444', '¿Diseña interfaces de usuario intuitivas y funcionales?', true, NOW(), NOW()),
('i4444442-4444-4444-4444-444444444444', 'j4444444-4444-4444-4444-444444444444', 'f4444444-4444-4444-4444-444444444444', '¿Considera principios de accesibilidad en sus diseños?', true, NOW(), NOW()),

-- Evaluación Practicante 5
('i5555551-5555-5555-5555-555555555555', 'j5555555-5555-5555-5555-555555555555', 'f5555555-5555-5555-5555-555555555555', '¿Configura y mantiene infraestructura cloud adecuadamente?', true, NOW(), NOW()),
('i5555552-5555-5555-5555-555555555555', 'j5555555-5555-5555-5555-555555555555', 'f5555555-5555-5555-5555-555555555555', '¿Implementa soluciones de monitoreo y logging efectivas?', true, NOW(), NOW());

-- ============================================
-- TABLA: evaluacion_practicante_solicitud
-- Depende de: dimension_transversal (id_dimension_transversal), evaluacion_practicante (id_evaluacion_practicante)
-- ============================================
INSERT INTO evaluacion_practicante_solicitud (id, id_dimension_transversal, id_evaluacion_practicante, valor, created_at, updated_at) VALUES
-- Evaluación Practicante 1
('k1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'Siempre', NOW(), NOW()),
('k1111112-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'f1111111-1111-1111-1111-111111111111', 'Frecuentemente', NOW(), NOW()),

-- Evaluación Practicante 2
('k2222221-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', 'f2222222-2222-2222-2222-222222222222', 'Siempre', NOW(), NOW()),
('k2222222-2222-2222-2222-222222222222', 'a4444444-4444-4444-4444-444444444444', 'f2222222-2222-2222-2222-222222222222', 'Siempre', NOW(), NOW()),

-- Evaluación Practicante 3
('k3333331-3333-3333-3333-333333333333', 'a5555555-5555-5555-5555-555555555555', 'f3333333-3333-3333-3333-333333333333', 'Frecuentemente', NOW(), NOW()),
('k3333332-3333-3333-3333-333333333333', 'a6666666-6666-6666-6666-666666666666', 'f3333333-3333-3333-3333-333333333333', 'Siempre', NOW(), NOW()),

-- Evaluación Practicante 4
('k4444441-4444-4444-4444-444444444444', 'a7777777-7777-7777-7777-777777777777', 'f4444444-4444-4444-4444-444444444444', 'Ocasionalmente', NOW(), NOW()),
('k4444442-4444-4444-4444-444444444444', 'a8888888-8888-8888-8888-888888888888', 'f4444444-4444-4444-4444-444444444444', 'Frecuentemente', NOW(), NOW()),

-- Evaluación Practicante 5
('k5555551-5555-5555-5555-555555555555', 'a9999999-9999-9999-9999-999999999999', 'f5555555-5555-5555-5555-555555555555', 'Frecuentemente', NOW(), NOW()),
('k5555552-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'f5555555-5555-5555-5555-555555555555', 'Siempre', NOW(), NOW());

-- =============================================
-- RESUMEN DE DATOS INSERTADOS
-- =============================================
-- ✅ dimension_transversal: 10 registros
-- ✅ preguntas: 10 registros
-- ✅ evaluacion_supervisor: 5 registros
-- ✅ evaluacion_practicante: 5 registros
-- ✅ evaluacion_preguntas: 10 registros (2 por evaluación supervisor)
-- ✅ preguntas_linea: 10 registros (2 por evaluación practicante)
-- ✅ evaluacion_practicante_solicitud: 10 registros (2 por evaluación practicante)
-- =============================================
-- TOTAL: 60 registros insertados
-- =============================================

-- NOTA IMPORTANTE: 
-- Los siguientes UUIDs son referencias externas y deben existir en otras bases de datos:
-- - id_supervisor (d1111111..., d2222222..., d3333333...) → Base de datos AUTH (tabla supervisores)
-- - id_alumno (e1111111..., e2222222..., etc.) → Base de datos AUTH (tabla alumnos)
-- - id_solicitud (g1111111..., g2222222..., etc.) → Base de datos COMPANIAS (tabla solicitudes_ppp)
-- - id_linea_facultad (j1111111..., j2222222..., etc.) → Base de datos CORE (tabla lineas_facultad)
-- 
-- Si estos UUIDs no existen, las inserciones fallarán por violación de integridad referencial.
-- Ejecuta primero queries en esas bases de datos para obtener IDs válidos o inserta datos allí primero.
