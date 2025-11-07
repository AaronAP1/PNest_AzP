import { IsString, MaxLength, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmpresaDto {
  @ApiProperty({ 
    description: 'Nombre de la empresa', 
    example: 'Tech Solutions S.A.C.',
    maxLength: 255
  })
  @IsString()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({ 
    description: 'Nombre del representante legal', 
    example: 'Juan Carlos Pérez López',
    maxLength: 255
  })
  @IsString()
  @MaxLength(255)
  nombreRepresentante: string;

  @ApiProperty({ 
    description: 'RUC de la empresa (11 dígitos)', 
    example: '20123456789',
    minLength: 11,
    maxLength: 11
  })
  @IsString()
  @Length(11, 11)
  ruc: string;

  @ApiProperty({ 
    description: 'Sector económico', 
    example: 'Tecnología',
    maxLength: 100
  })
  @IsString()
  @MaxLength(100)
  sector: string;

  @ApiProperty({ 
    description: 'Grado académico del representante', 
    example: 'Ingeniero de Sistemas',
    maxLength: 100
  })
  @IsString()
  @MaxLength(100)
  gradoAcademico: string;

  @ApiProperty({ 
    description: 'Cargo del representante', 
    example: 'Gerente General',
    maxLength: 100
  })
  @IsString()
  @MaxLength(100)
  cargoRepresentante: string;

  @ApiProperty({ 
    description: 'Teléfono de contacto', 
    example: '987654321',
    maxLength: 15
  })
  @IsString()
  @MaxLength(15)
  telefono: string;

  @ApiProperty({ 
    description: 'Área de práctica disponible', 
    example: 'Desarrollo de Software',
    maxLength: 100
  })
  @IsString()
  @MaxLength(100)
  areaPractica: string;

  @ApiProperty({ 
    description: 'Dirección completa de la empresa', 
    example: 'Av. Arequipa 1234, Miraflores, Lima'
  })
  @IsString()
  direccion: string;
}
