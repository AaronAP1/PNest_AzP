import { IsString, IsBoolean, IsOptional, MaxLength, IsUUID } from 'class-validator';

export class CreateEscuelaDto {
  @IsUUID()
  idFacultad: string;

  @IsString()
  @MaxLength(255)
  nombre: string;

  @IsString()
  @MaxLength(50)
  codigo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
