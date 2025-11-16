import { IsString, IsUUID, IsOptional, IsDateString, MaxLength } from 'class-validator';

export class CreateCartaPresentacionDto {
  @IsUUID()
  idAlumno: string;

  @IsUUID()
  idEmpresa: string;

  @IsOptional()
  @IsUUID()
  idSecretaria?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  areaPractica?: string;

  @IsDateString()
  fechaInicio: string;

  @IsOptional()
  @IsString()
  motivoRechazo?: string;

  @IsOptional()
  @IsString()
  estado?: string;
}
