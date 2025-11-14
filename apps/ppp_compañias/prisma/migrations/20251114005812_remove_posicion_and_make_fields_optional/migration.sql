/*
  Warnings:

  - You are about to drop the column `posicion` on the `carta_presentacion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "carta_presentacion" DROP COLUMN "posicion",
ALTER COLUMN "area_practica" DROP NOT NULL;
