import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRolDto {
  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Alumno',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción del rol',
    example: 'Estudiante de la universidad',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string;
}
