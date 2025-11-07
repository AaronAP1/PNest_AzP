import { IsString, MaxLength, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEscuelaDto {
  @ApiProperty({ 
    description: 'UUID de la facultad a la que pertenece', 
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  idFacultad: string;

  @ApiProperty({ 
    description: 'Código único de la escuela', 
    example: 'ESC-SIS',
    maxLength: 50
  })
  @IsString()
  @MaxLength(50)
  codigo: string;

  @ApiProperty({ 
    description: 'Nombre de la escuela', 
    example: 'Escuela Profesional de Ingeniería de Sistemas',
    maxLength: 255
  })
  @IsString()
  @MaxLength(255)
  nombre: string;

  @ApiPropertyOptional({ 
    description: 'Descripción de la escuela', 
    example: 'Forma profesionales en desarrollo de software y tecnologías de información'
  })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
