import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString, IsOptional, IsInt, IsIn } from 'class-validator';
import { ESTADO_EVALUACION_PRACTICANTE, VALORES_ESTADO_EVALUACION_PRACTICANTE } from '../../../constants/estados.constants';

export class CreateEvaluacionPracticanteDto {
  @ApiProperty({
    description: 'UUID de la solicitud PPP',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  idSolicitud: string;

  @ApiPropertyOptional({
    description: 'Comentarios adicionales sobre la evaluación del practicante',
    example: 'Buen desempeño durante el período de prácticas',
  })
  @IsOptional()
  @IsString()
  comentario?: string;

  @ApiPropertyOptional({
    description: 'Estado de revisión de la evaluación',
    enum: [ESTADO_EVALUACION_PRACTICANTE.PENDIENTE, ESTADO_EVALUACION_PRACTICANTE.EN_REVISION, ESTADO_EVALUACION_PRACTICANTE.CONFORME, ESTADO_EVALUACION_PRACTICANTE.RECHAZADO],
    example: ESTADO_EVALUACION_PRACTICANTE.PENDIENTE,
    default: ESTADO_EVALUACION_PRACTICANTE.PENDIENTE,
  })
  @IsOptional()
  @IsInt()
  @IsIn(VALORES_ESTADO_EVALUACION_PRACTICANTE, { message: 'Estado debe ser 0, 1, 5 o 99' })
  estado?: number;
}
