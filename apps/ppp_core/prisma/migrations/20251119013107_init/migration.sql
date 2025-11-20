-- CreateTable
CREATE TABLE "facultad" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "estado" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facultad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escuela" (
    "id" UUID NOT NULL,
    "id_facultad" UUID NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "estado" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "escuela_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linea_facultad" (
    "id" UUID NOT NULL,
    "id_escuela" UUID NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "estado" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "linea_facultad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "escuela_id_facultad_idx" ON "escuela"("id_facultad");

-- CreateIndex
CREATE INDEX "linea_facultad_id_escuela_idx" ON "linea_facultad"("id_escuela");

-- AddForeignKey
ALTER TABLE "escuela" ADD CONSTRAINT "escuela_id_facultad_fkey" FOREIGN KEY ("id_facultad") REFERENCES "facultad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linea_facultad" ADD CONSTRAINT "linea_facultad_id_escuela_fkey" FOREIGN KEY ("id_escuela") REFERENCES "escuela"("id") ON DELETE CASCADE ON UPDATE CASCADE;
