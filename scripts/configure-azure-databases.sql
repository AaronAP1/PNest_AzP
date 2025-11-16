# ==============================================================================
# Script SQL: Crear extensiones y configuraciones para cada BD
# Ejecutar después de crear las bases de datos
# ==============================================================================

-- ====================================
-- Base de datos: ppp_auth_db
-- ====================================
\c ppp_auth_db;

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Configuración de zona horaria
SET timezone = 'America/Lima';

COMMENT ON DATABASE ppp_auth_db IS 'Base de datos de autenticación y gestión de usuarios del sistema PPP';

-- ====================================
-- Base de datos: ppp_academic_db
-- ====================================
\c ppp_academic_db;

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configuración de zona horaria
SET timezone = 'America/Lima';

COMMENT ON DATABASE ppp_academic_db IS 'Base de datos académica: facultades, escuelas, alumnos, personal académico';

-- ====================================
-- Base de datos: ppp_core_db
-- ====================================
\c ppp_core_db;

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configuración de zona horaria
SET timezone = 'America/Lima';

COMMENT ON DATABASE ppp_core_db IS 'Base de datos principal: empresas, solicitudes PPP, cartas, documentos';

-- ====================================
-- Base de datos: ppp_evaluaciones_db
-- ====================================
\c ppp_evaluaciones_db;

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configuración de zona horaria
SET timezone = 'America/Lima';

COMMENT ON DATABASE ppp_evaluaciones_db IS 'Base de datos de evaluaciones: supervisor, practicante, preguntas';
