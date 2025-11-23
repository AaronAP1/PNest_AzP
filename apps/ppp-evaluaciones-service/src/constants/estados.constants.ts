/**
 * Constantes para estados numéricos de evaluaciones
 * Usar estos valores en lugar de números hardcodeados
 */

export const ESTADO_EVALUACION_SUPERVISOR = {
  PENDIENTE: 0,    // Supervisor aún no ha evaluado
  EVALUADO: 5,     // Supervisor completó la evaluación
} as const;

export const ESTADO_EVALUACION_PRACTICANTE = {
  PENDIENTE: 0,      // Alumno creó autoevaluación, esperando revisión
  EN_REVISION: 1,    // Coordinador revisando actualmente
  CONFORME: 5,       // Coordinador aprobó (estado final exitoso)
  RECHAZADO: 99,     // Coordinador rechazó (alumno debe corregir)
} as const;

// Tipos TypeScript para type safety
export type EstadoEvaluacionSupervisorType = typeof ESTADO_EVALUACION_SUPERVISOR[keyof typeof ESTADO_EVALUACION_SUPERVISOR];
export type EstadoEvaluacionPracticanteType = typeof ESTADO_EVALUACION_PRACTICANTE[keyof typeof ESTADO_EVALUACION_PRACTICANTE];

// Arrays de valores permitidos para validación
export const VALORES_ESTADO_EVALUACION_SUPERVISOR = Object.values(ESTADO_EVALUACION_SUPERVISOR);
export const VALORES_ESTADO_EVALUACION_PRACTICANTE = Object.values(ESTADO_EVALUACION_PRACTICANTE);
