/**
 * Constantes para estados numéricos del sistema PPP
 * Usar estos valores en lugar de números hardcodeados
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

// Tipos TypeScript para type safety
export type EstadoSolicitudType = typeof ESTADO_SOLICITUD[keyof typeof ESTADO_SOLICITUD];
export type EstadoCartaType = typeof ESTADO_CARTA[keyof typeof ESTADO_CARTA];
export type EstadoReunionType = typeof ESTADO_REUNION[keyof typeof ESTADO_REUNION];

// Arrays de valores permitidos para validación
export const VALORES_ESTADO_SOLICITUD = Object.values(ESTADO_SOLICITUD);
export const VALORES_ESTADO_CARTA = Object.values(ESTADO_CARTA);
export const VALORES_ESTADO_REUNION = Object.values(ESTADO_REUNION);
