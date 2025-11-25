import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateLineaFacultadDto {
  @ApiProperty({
    description: 'UUID de la escuela a la que pertenece la línea',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  idEscuela: string;

  @ApiProperty({
    description: 'Nombre de la línea de facultad',
    example: 'Desarrollo de Software',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({
    description: 'Código único de la línea',
    example: 'DS-001',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  codigo: string;
}
