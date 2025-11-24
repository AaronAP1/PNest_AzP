import { IsString, MaxLength, IsOptional, IsArray, IsUUID, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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

  @ApiPropertyOptional({
    description: 'Estado del rol (1 = Activo, 0 = Inactivo)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  estado?: number;

  @ApiPropertyOptional({
    description: 'IDs de los privilegios a asignar al rol',
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  privilegiosIds?: string[];
}
