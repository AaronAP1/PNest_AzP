import { IsString, IsUUID, IsOptional, IsDateString, MaxLength, IsEnum } from 'class-validator';
import { CartaEstado } from '../../../../../../node_modules/.prisma/client-companias';

export class CreateCartaPresentacionDto {
  @IsUUID()
  idAlumno: string;

  @IsUUID()
  idEmpresa: string;

  @IsOptional()
  @IsUUID()
  idSecretaria?: string;

  @IsOptional()
  @IsUUID()
  documentoId?: string;

  @IsString()
  @MaxLength(255)
  posicion: string;

  @IsString()
  @MaxLength(100)
  areaPractica: string;

  @IsDateString()
  fechaInicio: string;

  @IsOptional()
  @IsString()
  motivoRechazo?: string;

  @IsOptional()
  @IsEnum(CartaEstado)
  estado?: CartaEstado;
}
