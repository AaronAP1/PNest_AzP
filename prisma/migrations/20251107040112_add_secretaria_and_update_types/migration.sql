/*
  Warnings:

  - You are about to alter the column `ciclo` on the `alumno` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(10)`.
  - You are about to alter the column `año` on the `alumno` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(4)`.
  - You are about to alter the column `codigo` on the `escuela` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `codigo` on the `facultad` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `nombre` on the `rol` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "alumno" ALTER COLUMN "ciclo" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "año" SET DATA TYPE VARCHAR(4);

-- AlterTable
ALTER TABLE "escuela" ALTER COLUMN "codigo" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "descripcion" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "facultad" ALTER COLUMN "codigo" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "descripcion" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "rol" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "descripcion" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "secretaria" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "id_escuela" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "secretaria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "secretaria" ADD CONSTRAINT "secretaria_id_escuela_fkey" FOREIGN KEY ("id_escuela") REFERENCES "escuela"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
