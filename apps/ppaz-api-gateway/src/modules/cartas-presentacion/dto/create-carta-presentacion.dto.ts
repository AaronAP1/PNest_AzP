import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsDateString, MaxLength, IsNotEmpty, IsInt, IsIn } from 'class-validator';
import { ESTADO_CARTA, VALORES_ESTADO_CARTA } from '../../../constants/estados.constants';

export class CreateCartaPresentacionDto {
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
    enum: [ESTADO_CARTA.PENDIENTE, ESTADO_CARTA.EN_PROCESO, ESTADO_CARTA.ENTREGADO, ESTADO_CARTA.RECHAZADO],
    example: ESTADO_CARTA.PENDIENTE,
    required: false,
    default: ESTADO_CARTA.PENDIENTE,
  })
  @IsOptional()
  @IsInt()
  @IsIn(VALORES_ESTADO_CARTA, { message: 'Estado debe ser 0, 1, 5 o 99' })
  estado?: number;
}
