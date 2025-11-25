-- AlterTable
ALTER TABLE "privilegio" ADD COLUMN     "estado" SMALLINT NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "rol" ADD COLUMN     "estado" SMALLINT NOT NULL DEFAULT 1;
