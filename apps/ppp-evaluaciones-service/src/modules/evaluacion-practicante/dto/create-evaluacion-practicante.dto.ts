import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

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
    description: 'Estado de la evaluación (activo/inactivo)',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  estado?: boolean;
}
