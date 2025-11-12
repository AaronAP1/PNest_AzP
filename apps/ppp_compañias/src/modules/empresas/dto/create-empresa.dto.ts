import { IsString, MaxLength, Length, IsOptional } from 'class-validator';

export class CreateEmpresaDto {
  @IsString()
  @MaxLength(255)
  nombre: string;

  @IsString()
  @MaxLength(255)
  nombreRepresentante: string;

  @IsString()
  @Length(11, 11)
  ruc: string;

  @IsString()
  @MaxLength(100)
  sector: string;

  @IsString()
  @MaxLength(100)
  gradoAcademico: string;

  @IsString()
  @MaxLength(100)
  cargoRepresentante: string;

  @IsString()
  @MaxLength(15)
  telefono: string;

  @IsString()
  direccion: string;
}
