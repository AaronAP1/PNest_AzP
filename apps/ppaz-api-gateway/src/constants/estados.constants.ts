/**
 * Constantes para estados numéricos del sistema PPP - Gateway
 * Sincronizado con microservicios ppp_companias y ppp-evaluaciones-service
 */

export const ESTADO_SOLICITUD = {
  EN_PROCESO: 0,   // Solicitud creada, en revisión inicial
  ASIGNADO: 1,     // Supervisor asignado al alumno
  FINALIZADO: 5,   // Prácticas completadas exitosamente
  RECHAZADO: 99,   // Solicitud denegada por admin/coordinador
} as const;

export const ESTADO_CARTA = {
  PENDIENTE: 0,    // Carta creada pero no enviada
  EN_PROCESO: 1,   // Enviada a empresa, esperando respuesta
  ENTREGADO: 5,    // Empresa recibió y aceptó
  RECHAZADO: 99,   // Empresa rechazó la carta
} as const;

export const ESTADO_REUNION = {
  PENDIENTE: 0,    // Programada pero no realizada
  REALIZADA: 5,    // Completada
  CANCELADA: 99,   // Cancelada
} as const;

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
export type EstadoSolicitudType = typeof ESTADO_SOLICITUD[keyof typeof ESTADO_SOLICITUD];
export type EstadoCartaType = typeof ESTADO_CARTA[keyof typeof ESTADO_CARTA];
export type EstadoReunionType = typeof ESTADO_REUNION[keyof typeof ESTADO_REUNION];
export type EstadoEvaluacionSupervisorType = typeof ESTADO_EVALUACION_SUPERVISOR[keyof typeof ESTADO_EVALUACION_SUPERVISOR];
export type EstadoEvaluacionPracticanteType = typeof ESTADO_EVALUACION_PRACTICANTE[keyof typeof ESTADO_EVALUACION_PRACTICANTE];

// Arrays de valores permitidos para validación
export const VALORES_ESTADO_SOLICITUD = Object.values(ESTADO_SOLICITUD);
export const VALORES_ESTADO_CARTA = Object.values(ESTADO_CARTA);
export const VALORES_ESTADO_REUNION = Object.values(ESTADO_REUNION);
export const VALORES_ESTADO_EVALUACION_SUPERVISOR = Object.values(ESTADO_EVALUACION_SUPERVISOR);
export const VALORES_ESTADO_EVALUACION_PRACTICANTE = Object.values(ESTADO_EVALUACION_PRACTICANTE);
