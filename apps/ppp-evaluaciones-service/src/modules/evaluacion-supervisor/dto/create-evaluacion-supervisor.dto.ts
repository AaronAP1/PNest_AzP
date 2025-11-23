import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsInt, IsIn, IsOptional, IsNotEmpty } from 'class-validator';
import { ESTADO_EVALUACION_SUPERVISOR, VALORES_ESTADO_EVALUACION_SUPERVISOR } from '../../../constants/estados.constants';

export class CreateEvaluacionSupervisorDto {
  @ApiProperty({
    description: 'UUID del supervisor evaluador (referencia a ppp_auth.supervisores)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID del supervisor es obligatorio' })
  @IsUUID('4', { message: 'El ID del supervisor debe ser un UUID válido' })
  idSupervisor: string;

  @ApiProperty({
    description: 'UUID del alumno evaluado (referencia a ppp_auth.alumnos)',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty({ message: 'El ID del alumno es obligatorio' })
  @IsUUID('4', { message: 'El ID del alumno debe ser un UUID válido' })
  idAlumno: string;

  @ApiProperty({
    description: 'Comentarios generales del supervisor sobre el desempeño del alumno',
    example: 'El alumno demostró excelente capacidad de adaptación y trabajo en equipo.',
    required: false,
  })
  @IsString()
  @IsOptional()
  comentario?: string;

  @ApiProperty({
    description: 'Estado de la evaluación',
    enum: [ESTADO_EVALUACION_SUPERVISOR.PENDIENTE, ESTADO_EVALUACION_SUPERVISOR.EVALUADO],
    example: ESTADO_EVALUACION_SUPERVISOR.PENDIENTE,
    required: false,
    default: ESTADO_EVALUACION_SUPERVISOR.PENDIENTE,
  })
  @IsOptional()
  @IsInt()
  @IsIn(VALORES_ESTADO_EVALUACION_SUPERVISOR, { message: 'Estado debe ser 0 (PENDIENTE) o 5 (EVALUADO)' })
  estado?: number;
}
