import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, IsIn, IsOptional } from 'class-validator';
import { ESTADO_REUNION, VALORES_ESTADO_REUNION } from '../../../constants/estados.constants';

export class CreateReunionDto {
  @ApiProperty({
    description: 'UUID de la solicitud PPP',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  idSolicitud: string;

  @ApiProperty({
    description: 'Estado de la reunión',
    enum: [ESTADO_REUNION.PENDIENTE, ESTADO_REUNION.REALIZADA, ESTADO_REUNION.CANCELADA],
    example: ESTADO_REUNION.PENDIENTE,
    required: false,
    default: ESTADO_REUNION.PENDIENTE,
  })
  @IsOptional()
  @IsInt()
  @IsIn(VALORES_ESTADO_REUNION, { message: 'Estado debe ser 0 (PENDIENTE), 5 (REALIZADA) o 99 (CANCELADA)' })
  estado?: number;
}
