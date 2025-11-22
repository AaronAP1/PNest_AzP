-- CreateEnum
CREATE TYPE "CartaEstado" AS ENUM ('draft', 'submitted', 'reviewing', 'approved', 'rejected', 'cancelled');

-- CreateTable
CREATE TABLE "empresa" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "nombre_representante" VARCHAR(255) NOT NULL,
    "ruc" CHAR(11) NOT NULL,
    "sector" VARCHAR(100) NOT NULL,
    "grado_academico" VARCHAR(100) NOT NULL,
    "cargo_representante" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(15) NOT NULL,
    "direccion" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_documento" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipo_documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documento" (
    "id" UUID NOT NULL,
    "id_tipo_documento" UUID NOT NULL,
    "nombre_archivo" VARCHAR(255) NOT NULL,
    "ruta_archivo" TEXT NOT NULL,
    "subido_por" UUID,
    "generado_por" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carta_presentacion" (
    "id" UUID NOT NULL,
    "id_alumno" UUID NOT NULL,
    "id_empresa" UUID NOT NULL,
    "id_secretaria" UUID,
    "documento_id" UUID,
    "posicion" VARCHAR(255) NOT NULL,
    "area_practica" VARCHAR(100) NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "motivo_rechazo" TEXT,
    "estado" "CartaEstado" NOT NULL DEFAULT 'draft',
    "submitted_at" TIMESTAMPTZ(6),
    "reviewed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carta_presentacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "empresa_ruc_key" ON "empresa"("ruc");

-- CreateIndex
CREATE INDEX "carta_presentacion_id_alumno_idx" ON "carta_presentacion"("id_alumno");

-- CreateIndex
CREATE INDEX "carta_presentacion_id_empresa_idx" ON "carta_presentacion"("id_empresa");

-- CreateIndex
CREATE INDEX "carta_presentacion_id_secretaria_idx" ON "carta_presentacion"("id_secretaria");

-- CreateIndex
CREATE INDEX "carta_presentacion_estado_idx" ON "carta_presentacion"("estado");

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "documento_id_tipo_documento_fkey" FOREIGN KEY ("id_tipo_documento") REFERENCES "tipo_documento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carta_presentacion" ADD CONSTRAINT "carta_presentacion_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carta_presentacion" ADD CONSTRAINT "carta_presentacion_documento_id_fkey" FOREIGN KEY ("documento_id") REFERENCES "documento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
