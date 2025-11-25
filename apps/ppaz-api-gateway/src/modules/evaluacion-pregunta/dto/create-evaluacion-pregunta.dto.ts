import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateEvaluacionPreguntaDto {
  @ApiProperty({
    description: 'UUID de la evaluación',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  idEvaluacion: string;

  @ApiProperty({
    description: 'UUID de la pregunta',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsNotEmpty()
  @IsUUID()
  idPregunta: string;

  @ApiProperty({
    description: 'Valor de la respuesta',
    example: 'Excelente',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  valor: string;
}
