/*
  Warnings:

  - The values [draft,submitted,reviewing,approved,rejected,cancelled] on the enum `CartaEstado` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `documento_id` on the `carta_presentacion` table. All the data in the column will be lost.
  - You are about to drop the column `reviewed_at` on the `carta_presentacion` table. All the data in the column will be lost.
  - You are about to drop the column `submitted_at` on the `carta_presentacion` table. All the data in the column will be lost.
  - You are about to drop the column `id_tipo_documento` on the `documento` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_solicitud]` on the table `carta_presentacion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_solicitud_ppp` to the `documento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_tipodocumento` to the `documento` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('pendiente', 'en_proceso', 'aprobado', 'rechazado', 'cancelado');

-- CreateEnum
CREATE TYPE "EstadoReunion" AS ENUM ('pendiente', 'realizada', 'cancelada');

-- AlterEnum
BEGIN;
CREATE TYPE "CartaEstado_new" AS ENUM ('borrador', 'enviada', 'aprobada', 'rechazada');
ALTER TABLE "public"."carta_presentacion" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "carta_presentacion" ALTER COLUMN "estado" TYPE "CartaEstado_new" USING ("estado"::text::"CartaEstado_new");
ALTER TYPE "CartaEstado" RENAME TO "CartaEstado_old";
ALTER TYPE "CartaEstado_new" RENAME TO "CartaEstado";
DROP TYPE "public"."CartaEstado_old";
ALTER TABLE "carta_presentacion" ALTER COLUMN "estado" SET DEFAULT 'borrador';
COMMIT;

-- DropForeignKey
ALTER TABLE "carta_presentacion" DROP CONSTRAINT "carta_presentacion_documento_id_fkey";

-- DropForeignKey
ALTER TABLE "carta_presentacion" DROP CONSTRAINT "carta_presentacion_id_empresa_fkey";

-- DropForeignKey
ALTER TABLE "documento" DROP CONSTRAINT "documento_id_tipo_documento_fkey";

-- AlterTable
ALTER TABLE "carta_presentacion" DROP COLUMN "documento_id",
DROP COLUMN "reviewed_at",
DROP COLUMN "submitted_at",
ADD COLUMN     "archivo" TEXT,
ADD COLUMN     "id_solicitud" UUID,
ALTER COLUMN "area_practica" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "estado" SET DEFAULT 'borrador';

-- AlterTable
ALTER TABLE "documento" DROP COLUMN "id_tipo_documento",
ADD COLUMN     "id_solicitud_ppp" UUID NOT NULL,
ADD COLUMN     "id_tipodocumento" UUID NOT NULL;

-- CreateTable
CREATE TABLE "solicitud_ppp" (
    "id" UUID NOT NULL,
    "id_supervisor" UUID NOT NULL,
    "id_alumno" UUID NOT NULL,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'pendiente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitud_ppp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reuniones" (
    "id" UUID NOT NULL,
    "id_solicitud" UUID NOT NULL,
    "estado" "EstadoReunion" NOT NULL DEFAULT 'pendiente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reuniones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "solicitud_ppp_id_supervisor_idx" ON "solicitud_ppp"("id_supervisor");

-- CreateIndex
CREATE INDEX "solicitud_ppp_id_alumno_idx" ON "solicitud_ppp"("id_alumno");

-- CreateIndex
CREATE INDEX "solicitud_ppp_estado_idx" ON "solicitud_ppp"("estado");

-- CreateIndex
CREATE INDEX "reuniones_id_solicitud_idx" ON "reuniones"("id_solicitud");

-- CreateIndex
CREATE UNIQUE INDEX "carta_presentacion_id_solicitud_key" ON "carta_presentacion"("id_solicitud");

-- CreateIndex
CREATE INDEX "documento_id_solicitud_ppp_idx" ON "documento"("id_solicitud_ppp");

-- AddForeignKey
ALTER TABLE "carta_presentacion" ADD CONSTRAINT "carta_presentacion_id_solicitud_fkey" FOREIGN KEY ("id_solicitud") REFERENCES "solicitud_ppp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reuniones" ADD CONSTRAINT "reuniones_id_solicitud_fkey" FOREIGN KEY ("id_solicitud") REFERENCES "solicitud_ppp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "documento_id_tipodocumento_fkey" FOREIGN KEY ("id_tipodocumento") REFERENCES "tipo_documento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "documento_id_solicitud_ppp_fkey" FOREIGN KEY ("id_solicitud_ppp") REFERENCES "solicitud_ppp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
