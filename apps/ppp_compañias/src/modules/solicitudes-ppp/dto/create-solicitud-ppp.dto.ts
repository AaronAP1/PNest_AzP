import { IsUUID, IsEnum, IsOptional } from 'class-validator';

export enum EstadoSolicitud {
  pendiente = 'pendiente',
  en_proceso = 'en_proceso',
  aprobado = 'aprobado',
  rechazado = 'rechazado',
  cancelado = 'cancelado'
}

export class CreateSolicitudPppDto {
  @IsUUID()
  idSupervisor: string;

  @IsUUID()
  idAlumno: string;

  @IsEnum(EstadoSolicitud)
  @IsOptional()
  estado?: EstadoSolicitud;
}
