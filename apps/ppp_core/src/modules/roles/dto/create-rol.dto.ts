import { IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateRolDto {
  @IsString()
  @MaxLength(255)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string;
}
