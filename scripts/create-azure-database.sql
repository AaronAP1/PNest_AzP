-- ============================================
-- Script para crear base de datos pppNest en Azure PostgreSQL
-- ============================================

-- IMPORTANTE: Este script debe ejecutarse conectado a la base de datos 'postgres' o 'upeu_ppp_system'
-- con el usuario 'upeuadmin'

-- Crear la base de datos pppNest si no existe
-- SELECT 'CREATE DATABASE "pppNest"' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'pppNest')\gexec

-- Para Azure PostgreSQL, ejecuta este comando manualmente:
CREATE DATABASE "pppNest"
    WITH 
    OWNER = upeuadmin
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Dar permisos al usuario
GRANT ALL PRIVILEGES ON DATABASE "pppNest" TO upeuadmin;

-- Comentario de la base de datos
COMMENT ON DATABASE "pppNest" IS 'Base de datos para microservicios NestJS - Sistema PPP UPEU';
