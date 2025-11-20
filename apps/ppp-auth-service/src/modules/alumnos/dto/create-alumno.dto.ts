import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateAlumnoDto {
  @ApiProperty({
    description: 'ID del usuario asociado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El usuario ID es obligatorio' })
  @IsUUID('4', { message: 'El usuario ID debe ser un UUID válido' })
  usuarioId: string;

  @ApiProperty({
    description: 'ID de la escuela profesional',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty({ message: 'El ID de escuela es obligatorio' })
  @IsUUID('4', { message: 'El ID de escuela debe ser un UUID válido' })
  idEscuela: string;

  @ApiProperty({
    description: 'Código del alumno',
    example: '2020-123456',
    maxLength: 30,
  })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @IsString()
  @MaxLength(30, { message: 'El código no puede exceder 30 caracteres' })
  codigo: string;

  @ApiProperty({
    description: 'Ciclo actual del alumno',
    example: 'VIII',
    maxLength: 20,
  })
  @IsNotEmpty({ message: 'El ciclo es obligatorio' })
  @IsString()
  @MaxLength(20, { message: 'El ciclo no puede exceder 20 caracteres' })
  ciclo: string;

  @ApiProperty({
    description: 'Año de ingreso',
    example: '2020',
    maxLength: 4,
  })
  @IsNotEmpty({ message: 'El año es obligatorio' })
  @IsString()
  @MaxLength(4, { message: 'El año debe tener 4 caracteres' })
  año: string;
}
