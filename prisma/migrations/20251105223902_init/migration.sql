-- CreateEnum
CREATE TYPE "CartaEstado" AS ENUM ('draft', 'submitted', 'reviewing', 'approved', 'rejected', 'cancelled');

-- CreateTable
CREATE TABLE "rol" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" UUID NOT NULL,
    "nombres" VARCHAR(120) NOT NULL,
    "apellidos" VARCHAR(120) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "telefono" VARCHAR(20),
    "contraseña" VARCHAR(255) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_rol" (
    "usuarioId" UUID NOT NULL,
    "rolId" UUID NOT NULL,

    CONSTRAINT "usuario_rol_pkey" PRIMARY KEY ("usuarioId","rolId")
);

-- CreateTable
CREATE TABLE "facultad" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "codigo" VARCHAR(255) NOT NULL,
    "descripcion" VARCHAR(255),
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facultad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escuela" (
    "id" UUID NOT NULL,
    "id_facultad" UUID NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "codigo" VARCHAR(255) NOT NULL,
    "descripcion" VARCHAR(255),
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "escuela_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumno" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "id_escuela" UUID NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "ciclo" VARCHAR(20) NOT NULL,
    "año" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alumno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresa" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "nombre_representante" VARCHAR(255) NOT NULL,
    "ruc" VARCHAR(11) NOT NULL,
    "sector" VARCHAR(120) NOT NULL,
    "grado_academico" VARCHAR(120) NOT NULL,
    "cargo_representante" VARCHAR(120) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "area_practica" VARCHAR(120) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carta_presentacion" (
    "id" UUID NOT NULL,
    "id_alumno" UUID NOT NULL,
    "id_empresa" UUID NOT NULL,
    "posicion" VARCHAR(255) NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "secretaria_id" UUID,
    "motivo_rechazo" VARCHAR(255),
    "estado" "CartaEstado" NOT NULL,
    "submitted_at" TIMESTAMP(3),
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carta_presentacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "facultad_codigo_key" ON "facultad"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "escuela_codigo_key" ON "escuela"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "alumno_usuario_id_key" ON "alumno"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "alumno_codigo_key" ON "alumno"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "empresa_ruc_key" ON "empresa"("ruc");

-- CreateIndex
CREATE INDEX "carta_presentacion_id_alumno_idx" ON "carta_presentacion"("id_alumno");

-- CreateIndex
CREATE INDEX "carta_presentacion_id_empresa_idx" ON "carta_presentacion"("id_empresa");

-- CreateIndex
CREATE INDEX "carta_presentacion_estado_idx" ON "carta_presentacion"("estado");

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escuela" ADD CONSTRAINT "escuela_id_facultad_fkey" FOREIGN KEY ("id_facultad") REFERENCES "facultad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumno" ADD CONSTRAINT "alumno_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumno" ADD CONSTRAINT "alumno_id_escuela_fkey" FOREIGN KEY ("id_escuela") REFERENCES "escuela"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carta_presentacion" ADD CONSTRAINT "carta_presentacion_id_alumno_fkey" FOREIGN KEY ("id_alumno") REFERENCES "alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carta_presentacion" ADD CONSTRAINT "carta_presentacion_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carta_presentacion" ADD CONSTRAINT "carta_presentacion_secretaria_id_fkey" FOREIGN KEY ("secretaria_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
