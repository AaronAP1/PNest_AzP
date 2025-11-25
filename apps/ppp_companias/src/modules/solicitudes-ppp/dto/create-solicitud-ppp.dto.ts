import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, IsIn, IsOptional, IsNotEmpty, IsDateString, IsString, Min, Max } from 'class-validator';
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
    description: 'Fecha de inicio de las prácticas',
    example: '2024-03-01',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida (YYYY-MM-DD)' })
  fechaInicio?: string;

  @ApiProperty({
    description: 'Fecha de fin de las prácticas',
    example: '2024-08-31',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida (YYYY-MM-DD)' })
  fechaFin?: string;

  @ApiProperty({
    description: 'Lugar donde se realizarán las prácticas',
    example: 'Oficina Central - Lima',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'El lugar de realización debe ser un texto' })
  lugarRealizacion?: string;

  @ApiProperty({
    description: 'Horario de trabajo del practicante',
    example: 'Lunes a Viernes 8:00 AM - 5:00 PM',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'El horario de trabajo debe ser un texto' })
  horarioTrabajo?: string;

  @ApiProperty({
    description: 'Cantidad de horas semanales de práctica',
    example: 40,
    required: false,
    minimum: 1,
    maximum: 168,
  })
  @IsOptional()
  @IsInt({ message: 'Las horas por semana deben ser un número entero' })
  @Min(1, { message: 'Las horas por semana deben ser al menos 1' })
  @Max(168, { message: 'Las horas por semana no pueden exceder 168 (7 días × 24 horas)' })
  horasPorSemana?: number;

  @ApiProperty({
    description: 'Área específica donde el practicante realizará sus actividades',
    example: 'Desarrollo de Software - Backend',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'El área del practicante debe ser un texto' })
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
  @IsIn(VALORES_ESTADO_SOLICITUD, { message: 'Estado debe ser 0 (EN_PROCESO), 1 (ASIGNADO), 5 (FINALIZADO) o 99 (RECHAZADO)' })
  estado?: number;
}
