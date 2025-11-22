import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString, IsOptional } from 'class-validator';

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
}
