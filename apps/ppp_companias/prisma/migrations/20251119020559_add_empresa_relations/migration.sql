/*
  Warnings:

  - Added the required column `id_empresa` to the `solicitud_ppp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "solicitud_ppp" ADD COLUMN     "id_empresa" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "solicitud_ppp_id_empresa_idx" ON "solicitud_ppp"("id_empresa");

-- AddForeignKey
ALTER TABLE "solicitud_ppp" ADD CONSTRAINT "solicitud_ppp_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carta_presentacion" ADD CONSTRAINT "carta_presentacion_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
