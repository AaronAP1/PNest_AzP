import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum TipoEntidad {
  ALUMNO = 'alumno',
  SECRETARIA = 'secretaria',
  SUPERVISOR = 'supervisor',
  COORDINADOR = 'coordinador'
}

export class AsignarUsuarioEntidadDto {
  @ApiProperty({
    description: 'UUID del usuario a asignar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  usuarioId: string;

  @ApiProperty({
    description: 'Tipo de entidad a la que se asignará el usuario',
    enum: TipoEntidad,
    example: TipoEntidad.ALUMNO,
  })
  @IsNotEmpty({ message: 'El tipo de entidad es obligatorio' })
  @IsEnum(TipoEntidad, { message: 'El tipo de entidad debe ser: alumno, secretaria, supervisor o coordinador' })
  tipoEntidad: TipoEntidad;

  @ApiProperty({
    description: 'UUID de la escuela asociada',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty({ message: 'El ID de la escuela es obligatorio' })
  @IsUUID('4', { message: 'El ID de la escuela debe ser un UUID válido' })
  idEscuela: string;

  // Campos específicos para Alumno
  @ApiProperty({
    description: 'Código del alumno (solo para tipo alumno)',
    example: '2020123456',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El código debe ser un texto' })
  codigo?: string;

  @ApiProperty({
    description: 'Ciclo actual del alumno (solo para tipo alumno)',
    example: 'IX',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El ciclo debe ser un texto' })
  ciclo?: string;

  @ApiProperty({
    description: 'Año de ingreso del alumno (solo para tipo alumno)',
    example: '2020',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El año debe ser un texto' })
  año?: string;
}
