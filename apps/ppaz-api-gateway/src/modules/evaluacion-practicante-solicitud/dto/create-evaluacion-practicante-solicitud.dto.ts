import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateEvaluacionPracticanteSolicitudDto {
  @ApiProperty({
    description: 'UUID de la dimensión transversal',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  idDimensionTransversal: string;

  @ApiProperty({
    description: 'UUID de la evaluación practicante',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsNotEmpty()
  @IsUUID()
  idEvaluacionPracticante: string;

  @ApiProperty({
    description: 'Valor de la evaluación',
    example: 'Muy bueno',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  valor: string;
}
