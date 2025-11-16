import { IsString, IsUUID, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class CreateLineaFacultadDto {
  @IsUUID()
  idEscuela: string;

  @IsString()
  @MaxLength(255)
  nombre: string;

  @IsString()
  @MaxLength(50)
  codigo: string;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
