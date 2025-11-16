-- CreateTable
CREATE TABLE "evaluacion_supervisor" (
    "id" UUID NOT NULL,
    "id_supervisor" UUID NOT NULL,
    "id_alumno" UUID NOT NULL,
    "comentario" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluacion_supervisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluacion_preguntas" (
    "id" UUID NOT NULL,
    "id_evaluacion" UUID NOT NULL,
    "id_pregunta" UUID NOT NULL,
    "valor" VARCHAR(255) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluacion_preguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preguntas" (
    "id" UUID NOT NULL,
    "preguntas" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "preguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluacion_practicante" (
    "id" UUID NOT NULL,
    "id_solicitud" UUID NOT NULL,
    "comentario" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluacion_practicante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluacion_practicante_solicitud" (
    "id" UUID NOT NULL,
    "id_dimension_transversal" UUID NOT NULL,
    "id_evaluacion_practicante" UUID NOT NULL,
    "valor" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluacion_practicante_solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preguntas_linea" (
    "id" UUID NOT NULL,
    "id_linea_facultad" UUID NOT NULL,
    "id_evaluacion_practicante" UUID NOT NULL,
    "preguntas" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "preguntas_linea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dimension_transversal" (
    "id" UUID NOT NULL,
    "pregunta" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dimension_transversal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "evaluacion_supervisor_id_supervisor_idx" ON "evaluacion_supervisor"("id_supervisor");

-- CreateIndex
CREATE INDEX "evaluacion_supervisor_id_alumno_idx" ON "evaluacion_supervisor"("id_alumno");

-- CreateIndex
CREATE INDEX "evaluacion_preguntas_id_evaluacion_idx" ON "evaluacion_preguntas"("id_evaluacion");

-- CreateIndex
CREATE INDEX "evaluacion_preguntas_id_pregunta_idx" ON "evaluacion_preguntas"("id_pregunta");

-- CreateIndex
CREATE INDEX "evaluacion_practicante_id_solicitud_idx" ON "evaluacion_practicante"("id_solicitud");

-- CreateIndex
CREATE INDEX "evaluacion_practicante_solicitud_id_dimension_transversal_idx" ON "evaluacion_practicante_solicitud"("id_dimension_transversal");

-- CreateIndex
CREATE INDEX "evaluacion_practicante_solicitud_id_evaluacion_practicante_idx" ON "evaluacion_practicante_solicitud"("id_evaluacion_practicante");

-- CreateIndex
CREATE INDEX "preguntas_linea_id_linea_facultad_idx" ON "preguntas_linea"("id_linea_facultad");

-- CreateIndex
CREATE INDEX "preguntas_linea_id_evaluacion_practicante_idx" ON "preguntas_linea"("id_evaluacion_practicante");

-- AddForeignKey
ALTER TABLE "evaluacion_preguntas" ADD CONSTRAINT "evaluacion_preguntas_id_evaluacion_fkey" FOREIGN KEY ("id_evaluacion") REFERENCES "evaluacion_supervisor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluacion_preguntas" ADD CONSTRAINT "evaluacion_preguntas_id_pregunta_fkey" FOREIGN KEY ("id_pregunta") REFERENCES "preguntas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluacion_practicante_solicitud" ADD CONSTRAINT "evaluacion_practicante_solicitud_id_dimension_transversal_fkey" FOREIGN KEY ("id_dimension_transversal") REFERENCES "dimension_transversal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluacion_practicante_solicitud" ADD CONSTRAINT "evaluacion_practicante_solicitud_id_evaluacion_practicante_fkey" FOREIGN KEY ("id_evaluacion_practicante") REFERENCES "evaluacion_practicante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preguntas_linea" ADD CONSTRAINT "preguntas_linea_id_evaluacion_practicante_fkey" FOREIGN KEY ("id_evaluacion_practicante") REFERENCES "evaluacion_practicante"("id") ON DELETE CASCADE ON UPDATE CASCADE;
