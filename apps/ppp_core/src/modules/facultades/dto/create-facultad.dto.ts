import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class CreateFacultadDto {
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
