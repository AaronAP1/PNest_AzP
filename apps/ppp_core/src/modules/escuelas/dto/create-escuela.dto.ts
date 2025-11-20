import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, MaxLength, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateEscuelaDto {
  @ApiProperty({
    description: 'UUID de la facultad a la que pertenece',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID de facultad es obligatorio' })
  @IsUUID('4', { message: 'El ID de facultad debe ser un UUID válido' })
  idFacultad: string;

  @ApiProperty({
    description: 'Nombre de la escuela profesional',
    example: 'Ingeniería de Sistemas',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({
    description: 'Código único de la escuela',
    example: 'IS',
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @IsString()
  @MaxLength(50)
  codigo: string;

  @ApiProperty({
    description: 'Descripción de la escuela profesional',
    example: 'Escuela dedicada a la formación de ingenieros de sistemas',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Estado de la escuela (activo/inactivo)',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
