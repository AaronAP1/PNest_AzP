import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateFacultadDto {
  @ApiProperty({
    description: 'Nombre de la facultad',
    example: 'Facultad de Ingeniería',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({
    description: 'Código único de la facultad',
    example: 'FI',
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @IsString()
  @MaxLength(50)
  codigo: string;

  @ApiProperty({
    description: 'Descripción de la facultad',
    example: 'Facultad dedicada a la formación de ingenieros',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Estado de la facultad (activo/inactivo)',
    example: 'ACTIVO',
    required: false,
    default: 'ACTIVO',
  })
  @IsOptional()
  @IsString()
  @IsIn(['ACTIVO', 'INACTIVO'])
  estado?: string;
}
