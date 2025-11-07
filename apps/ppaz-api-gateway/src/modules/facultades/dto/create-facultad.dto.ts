import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFacultadDto {
  @ApiProperty({ 
    description: 'Código único de la facultad', 
    example: 'FAC-ING',
    maxLength: 50
  })
  @IsString()
  @MaxLength(50)
  codigo: string;

  @ApiProperty({ 
    description: 'Nombre de la facultad', 
    example: 'Facultad de Ingeniería',
    maxLength: 255
  })
  @IsString()
  @MaxLength(255)
  nombre: string;

  @ApiPropertyOptional({ 
    description: 'Descripción detallada de la facultad', 
    example: 'Facultad dedicada a la formación de ingenieros en diversas especialidades'
  })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
