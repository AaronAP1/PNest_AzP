import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDimensionTransversalDto {
  @ApiProperty({
    description: 'Texto de la pregunta de dimensión transversal',
    example: '¿Demuestra capacidad de trabajo en equipo?',
  })
  @IsNotEmpty()
  @IsString()
  pregunta: string;
}
