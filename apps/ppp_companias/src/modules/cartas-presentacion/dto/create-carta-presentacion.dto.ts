import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsDateString, MaxLength, IsNotEmpty, IsEnum } from 'class-validator';

export enum CartaEstado {
  borrador = 'borrador',
  presentada = 'presentada',
  en_revision = 'en_revision',
  aprobada = 'aprobada',
  rechazada = 'rechazada',
  cancelada = 'cancelada',
}

export class CreateCartaPresentacionDto {
  @ApiProperty({
    description: 'UUID de la solicitud PPP asociada (opcional)',
    example: '123e4567-e89b-12d3-a456-426614174999',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID de la solicitud debe ser un UUID válido' })
  idSolicitud?: string;

  @ApiProperty({
    description: 'UUID del alumno (referencia a ppp_auth.alumnos)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID del alumno es obligatorio' })
  @IsUUID('4', { message: 'El ID del alumno debe ser un UUID válido' })
  idAlumno: string;

  @ApiProperty({
    description: 'UUID de la empresa destino',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty({ message: 'El ID de la empresa es obligatorio' })
  @IsUUID('4', { message: 'El ID de la empresa debe ser un UUID válido' })
  idEmpresa: string;

  @ApiProperty({
    description: 'UUID de la secretaria asignada (referencia a ppp_auth.secretarias)',
    example: '123e4567-e89b-12d3-a456-426614174002',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID de la secretaria debe ser un UUID válido' })
  idSecretaria?: string;

  @ApiProperty({
    description: 'Área de práctica dentro de la empresa',
    example: 'Desarrollo de Software',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  areaPractica?: string;

  @ApiProperty({
    description: 'Fecha de inicio de prácticas (formato ISO 8601)',
    example: '2024-03-15',
  })
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
  @IsDateString({}, { message: 'La fecha debe estar en formato ISO 8601' })
  fechaInicio: string;

  @ApiProperty({
    description: 'Motivo de rechazo de la carta (si aplica)',
    required: false,
  })
  @IsOptional()
  @IsString()
  motivoRechazo?: string;

  @ApiProperty({
    description: 'Estado de la carta de presentación',
    enum: CartaEstado,
    example: CartaEstado.borrador,
    required: false,
    default: CartaEstado.borrador,
  })
  @IsOptional()
  @IsEnum(CartaEstado)
  estado?: string;
}
