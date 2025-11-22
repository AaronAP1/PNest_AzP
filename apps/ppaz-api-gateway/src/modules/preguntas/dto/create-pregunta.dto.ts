import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePreguntaDto {
  @ApiProperty({
    description: 'Texto de la pregunta',
    example: '¿Cómo calificaría el desempeño general del estudiante?',
  })
  @IsNotEmpty()
  @IsString()
  preguntas: string;
}
