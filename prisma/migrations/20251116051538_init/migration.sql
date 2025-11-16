/*
  Warnings:

  - You are about to drop the column `nombre` on the `secretaria` table. All the data in the column will be lost.
  - You are about to drop the `rol` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuario_rol` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `usuario_id` to the `secretaria` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "alumno" DROP CONSTRAINT "alumno_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "usuario_rol" DROP CONSTRAINT "usuario_rol_rolId_fkey";

-- DropForeignKey
ALTER TABLE "usuario_rol" DROP CONSTRAINT "usuario_rol_usuarioId_fkey";

-- AlterTable
ALTER TABLE "alumno" ALTER COLUMN "ciclo" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "secretaria" DROP COLUMN "nombre",
ADD COLUMN     "usuario_id" UUID NOT NULL;

-- DropTable
DROP TABLE "rol";

-- DropTable
DROP TABLE "usuario";

-- DropTable
DROP TABLE "usuario_rol";

-- CreateTable
CREATE TABLE "supervisor" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "id_escuela" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supervisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coordinador" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "id_escuela" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coordinador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linea_facultad" (
    "id" UUID NOT NULL,
    "id_escuela" UUID NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "linea_facultad_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "supervisor" ADD CONSTRAINT "supervisor_id_escuela_fkey" FOREIGN KEY ("id_escuela") REFERENCES "escuela"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coordinador" ADD CONSTRAINT "coordinador_id_escuela_fkey" FOREIGN KEY ("id_escuela") REFERENCES "escuela"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linea_facultad" ADD CONSTRAINT "linea_facultad_id_escuela_fkey" FOREIGN KEY ("id_escuela") REFERENCES "escuela"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
