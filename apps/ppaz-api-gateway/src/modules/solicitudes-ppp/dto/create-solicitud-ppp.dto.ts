import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsInt, IsIn, IsOptional } from 'class-validator';
import { ESTADO_SOLICITUD, VALORES_ESTADO_SOLICITUD } from '../../../constants/estados.constants';

export class CreateSolicitudPppDto {
  @ApiProperty({
    description: 'UUID del supervisor asignado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  idSupervisor: string;

  @ApiProperty({
    description: 'UUID del alumno solicitante',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsNotEmpty()
  @IsUUID()
  idAlumno: string;

  @ApiProperty({
    description: 'UUID de la empresa',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsNotEmpty()
  @IsUUID()
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
  @IsIn(VALORES_ESTADO_SOLICITUD, { message: 'Estado debe ser 0, 1, 5 o 99' })
  estado?: number;
}
