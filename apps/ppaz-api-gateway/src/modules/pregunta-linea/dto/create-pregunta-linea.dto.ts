import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString } from 'class-validator';

export class CreatePreguntaLineaDto {
  @ApiProperty({
    description: 'UUID de la línea de facultad',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  idLineaFacultad: string;

  @ApiProperty({
    description: 'UUID de la evaluación practicante',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsNotEmpty()
  @IsUUID()
  idEvaluacionPracticante: string;

  @ApiProperty({
    description: 'Texto de las preguntas específicas de la línea',
    example: '¿Aplicó los conocimientos de programación en el proyecto?',
  })
  @IsNotEmpty()
  @IsString()
  preguntas: string;
}
