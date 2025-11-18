-- Fix database schema for auth, core and evaluaciones services
-- Este script crea las tablas faltantes que las migraciones no pudieron crear

-- =================================
-- AUTH SERVICE - Tablas faltantes
-- =================================

-- Crear tabla rol si no existe
CREATE TABLE IF NOT EXISTS "rol" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "rol_pkey" PRIMARY KEY ("id")
);

-- Crear tabla usuario_rol si no existe
CREATE TABLE IF NOT EXISTS "usuario_rol" (
    "usuario_id" UUID NOT NULL,
    "rol_id" UUID NOT NULL,
    CONSTRAINT "usuario_rol_pkey" PRIMARY KEY ("usuario_id","rol_id")
);

-- Agregar foreign keys si no existen
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'usuario_rol_usuario_id_fkey'
    ) THEN
        ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_usuario_id_fkey" 
        FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'usuario_rol_rol_id_fkey'
    ) THEN
        ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_rol_id_fkey" 
        FOREIGN KEY ("rol_id") REFERENCES "rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

SELECT 'Auth tables created/verified' AS status;
