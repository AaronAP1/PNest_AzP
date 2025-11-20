-- CreateTable
CREATE TABLE "privilegio" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "privilegio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol_privilegio" (
    "id" UUID NOT NULL,
    "id_rol" UUID NOT NULL,
    "id_privilegio" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rol_privilegio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumno" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "id_escuela" UUID NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "ciclo" VARCHAR(20) NOT NULL,
    "año" VARCHAR(4) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alumno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secretaria" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "id_escuela" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "secretaria_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE INDEX "rol_privilegio_id_rol_idx" ON "rol_privilegio"("id_rol");

-- CreateIndex
CREATE INDEX "rol_privilegio_id_privilegio_idx" ON "rol_privilegio"("id_privilegio");

-- CreateIndex
CREATE UNIQUE INDEX "rol_privilegio_id_rol_id_privilegio_key" ON "rol_privilegio"("id_rol", "id_privilegio");

-- CreateIndex
CREATE INDEX "alumno_id_escuela_idx" ON "alumno"("id_escuela");

-- CreateIndex
CREATE UNIQUE INDEX "alumno_usuario_id_key" ON "alumno"("usuario_id");

-- CreateIndex
CREATE INDEX "secretaria_id_escuela_idx" ON "secretaria"("id_escuela");

-- CreateIndex
CREATE UNIQUE INDEX "secretaria_usuario_id_key" ON "secretaria"("usuario_id");

-- CreateIndex
CREATE INDEX "supervisor_id_escuela_idx" ON "supervisor"("id_escuela");

-- CreateIndex
CREATE UNIQUE INDEX "supervisor_usuario_id_key" ON "supervisor"("usuario_id");

-- CreateIndex
CREATE INDEX "coordinador_id_escuela_idx" ON "coordinador"("id_escuela");

-- CreateIndex
CREATE UNIQUE INDEX "coordinador_usuario_id_key" ON "coordinador"("usuario_id");

-- AddForeignKey
ALTER TABLE "rol_privilegio" ADD CONSTRAINT "rol_privilegio_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_privilegio" ADD CONSTRAINT "rol_privilegio_id_privilegio_fkey" FOREIGN KEY ("id_privilegio") REFERENCES "privilegio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumno" ADD CONSTRAINT "alumno_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secretaria" ADD CONSTRAINT "secretaria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supervisor" ADD CONSTRAINT "supervisor_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coordinador" ADD CONSTRAINT "coordinador_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
