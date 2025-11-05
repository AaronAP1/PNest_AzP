import { IsString, IsEmail, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @MaxLength(120)
  nombres: string;

  @IsString()
  @MaxLength(120)
  apellidos: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  contraseña: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsString()
  idRol: string;
}
