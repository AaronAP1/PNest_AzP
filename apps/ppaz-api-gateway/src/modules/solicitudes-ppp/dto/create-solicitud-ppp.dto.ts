import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsInt, IsIn, IsOptional, IsDateString, IsString, Min, Max } from 'class-validator';
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
    description: 'Fecha de inicio de las prácticas',
    example: '2024-03-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiProperty({
    description: 'Fecha de fin de las prácticas',
    example: '2024-08-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiProperty({
    description: 'Lugar donde se realizarán las prácticas',
    example: 'Oficina Central - Lima',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  lugarRealizacion?: string;

  @ApiProperty({
    description: 'Horario de trabajo del practicante',
    example: 'Lunes a Viernes 8:00 AM - 5:00 PM',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  horarioTrabajo?: string;

  @ApiProperty({
    description: 'Cantidad de horas semanales de práctica',
    example: 40,
    required: false,
    minimum: 1,
    maximum: 168,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(168)
  horasPorSemana?: number;

  @ApiProperty({
    description: 'Área específica donde el practicante realizará sus actividades',
    example: 'Desarrollo de Software - Backend',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  areaPracticante?: string;

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
