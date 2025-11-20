import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsBoolean, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateLineaFacultadDto {
  @ApiProperty({
    description: 'UUID de la escuela a la que pertenece',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID de escuela es obligatorio' })
  @IsUUID('4', { message: 'El ID de escuela debe ser un UUID válido' })
  idEscuela: string;

  @ApiProperty({
    description: 'Nombre de la línea de práctica o investigación',
    example: 'Desarrollo de Software',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({
    description: 'Código único de la línea',
    example: 'DS',
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @IsString()
  @MaxLength(50)
  codigo: string;

  @ApiProperty({
    description: 'Estado de la línea (activo/inactivo)',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
