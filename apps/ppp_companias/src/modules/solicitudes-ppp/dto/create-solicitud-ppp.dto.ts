import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, IsIn, IsOptional, IsNotEmpty } from 'class-validator';
import { ESTADO_SOLICITUD, VALORES_ESTADO_SOLICITUD } from '../../../constants/estados.constants';

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
    enum: [ESTADO_SOLICITUD.EN_PROCESO, ESTADO_SOLICITUD.ASIGNADO, ESTADO_SOLICITUD.FINALIZADO, ESTADO_SOLICITUD.RECHAZADO],
    example: ESTADO_SOLICITUD.EN_PROCESO,
    required: false,
    default: ESTADO_SOLICITUD.EN_PROCESO,
  })
  @IsOptional()
  @IsInt()
  @IsIn(VALORES_ESTADO_SOLICITUD, { message: 'Estado debe ser 0 (EN_PROCESO), 1 (ASIGNADO), 5 (FINALIZADO) o 99 (RECHAZADO)' })
  estado?: number;
}
