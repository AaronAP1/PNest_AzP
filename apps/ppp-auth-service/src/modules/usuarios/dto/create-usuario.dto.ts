import { IsString, IsEmail, IsOptional, IsBoolean, IsArray, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nombres: string;

  @IsString()
  @MinLength(2)
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

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  rolesIds?: string[];
}
