import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';

export enum EstadoSolicitud {
  pendiente = 'pendiente',
  en_proceso = 'en_proceso',
  aprobado = 'aprobado',
  rechazado = 'rechazado',
  cancelado = 'cancelado'
}

export class CreateSolicitudPppDto {
  @ApiProperty({
    description: 'UUID del supervisor asignado (referencia a ppp_auth.supervisores)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID del supervisor es obligatorio' })
  @IsUUID('4', { message: 'El ID del supervisor debe ser un UUID válido' })
  idSupervisor: string;

  @ApiProperty({
    description: 'UUID del alumno solicitante (referencia a ppp_auth.alumnos)',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty({ message: 'El ID del alumno es obligatorio' })
  @IsUUID('4', { message: 'El ID del alumno debe ser un UUID válido' })
  idAlumno: string;

  @ApiProperty({
    description: 'UUID de la empresa destino',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsNotEmpty({ message: 'El ID de la empresa es obligatorio' })
  @IsUUID('4', { message: 'El ID de la empresa debe ser un UUID válido' })
  idEmpresa: string;

  @ApiProperty({
    description: 'Estado de la solicitud',
    enum: EstadoSolicitud,
    example: EstadoSolicitud.pendiente,
    required: false,
    default: EstadoSolicitud.pendiente,
  })
  @IsEnum(EstadoSolicitud)
  @IsOptional()
  estado?: EstadoSolicitud;
}
