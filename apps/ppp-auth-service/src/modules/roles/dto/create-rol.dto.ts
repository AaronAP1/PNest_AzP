import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateRolDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;
}
