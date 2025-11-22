import { IsUUID, IsEnum, IsOptional } from 'class-validator';

export enum EstadoReunion {
  pendiente = 'pendiente',
  realizada = 'realizada',
  cancelada = 'cancelada'
}

export class CreateReunionDto {
  @IsUUID()
  idSolicitud: string;

  @IsEnum(EstadoReunion)
  @IsOptional()
  estado?: EstadoReunion;
}
