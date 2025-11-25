import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString, IsOptional, IsInt, IsIn } from 'class-validator';
import { ESTADO_EVALUACION_SUPERVISOR, VALORES_ESTADO_EVALUACION_SUPERVISOR } from '../../../constants/estados.constants';

export class CreateEvaluacionSupervisorDto {
  @ApiProperty({
    description: 'UUID del supervisor',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  idSupervisor: string;

  @ApiProperty({
    description: 'UUID del alumno',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsNotEmpty()
  @IsUUID()
  idAlumno: string;

  @ApiPropertyOptional({
    description: 'Comentarios adicionales sobre la evaluación',
    example: 'El estudiante mostró excelente desempeño en todas las áreas',
  })
  @IsOptional()
  @IsString()
  comentario?: string;

  @ApiPropertyOptional({
    description: 'Estado de la evaluación',
    enum: [ESTADO_EVALUACION_SUPERVISOR.PENDIENTE, ESTADO_EVALUACION_SUPERVISOR.EVALUADO],
    example: ESTADO_EVALUACION_SUPERVISOR.PENDIENTE,
    default: ESTADO_EVALUACION_SUPERVISOR.PENDIENTE,
  })
  @IsOptional()
  @IsInt()
  @IsIn(VALORES_ESTADO_EVALUACION_SUPERVISOR, { message: 'Estado debe ser 0 o 5' })
  estado?: number;
}
