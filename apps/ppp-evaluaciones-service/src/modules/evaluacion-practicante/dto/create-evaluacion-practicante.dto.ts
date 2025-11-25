import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsInt, IsIn, IsOptional, IsNotEmpty } from 'class-validator';
import { ESTADO_EVALUACION_PRACTICANTE, VALORES_ESTADO_EVALUACION_PRACTICANTE } from '../../../constants/estados.constants';

export class CreateEvaluacionPracticanteDto {
  @ApiProperty({
    description: 'UUID de la solicitud de PPP (referencia a ppp_companias.solicitud_ppp)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID de la solicitud es obligatorio' })
  @IsUUID('4', { message: 'El ID de la solicitud debe ser un UUID válido' })
  idSolicitud: string;

  @ApiProperty({
    description: 'Comentarios generales sobre el desempeño del practicante',
    example: 'El practicante mostró compromiso y responsabilidad en sus tareas.',
    required: false,
  })
  @IsString()
  @IsOptional()
  comentario?: string;

  @ApiProperty({
    description: 'Estado de revisión de la evaluación',
    enum: [ESTADO_EVALUACION_PRACTICANTE.PENDIENTE, ESTADO_EVALUACION_PRACTICANTE.EN_REVISION, ESTADO_EVALUACION_PRACTICANTE.CONFORME, ESTADO_EVALUACION_PRACTICANTE.RECHAZADO],
    example: ESTADO_EVALUACION_PRACTICANTE.PENDIENTE,
    required: false,
    default: ESTADO_EVALUACION_PRACTICANTE.PENDIENTE,
  })
  @IsOptional()
  @IsInt()
  @IsIn(VALORES_ESTADO_EVALUACION_PRACTICANTE, { message: 'Estado debe ser 0 (PENDIENTE), 1 (EN_REVISION), 5 (CONFORME) o 99 (RECHAZADO)' })
  estado?: number;
}
