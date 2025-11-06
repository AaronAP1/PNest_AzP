import { IsString, IsEmail, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Nombres del usuario',
    example: 'Juan Carlos',
    maxLength: 120,
  })
  @IsString()
  @MaxLength(120)
  nombres: string;

  @ApiProperty({
    description: 'Apellidos del usuario',
    example: 'Pérez García',
    maxLength: 120,
  })
  @IsString()
  @MaxLength(120)
  apellidos: string;

  @ApiProperty({
    description: 'Correo electrónico institucional del usuario',
    example: 'juan.perez@upeu.edu.pe',
    format: 'email',
    maxLength: 150,
  })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono del usuario',
    example: '987654321',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'SecureP@ss123',
    minLength: 6,
    maxLength: 255,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  contraseña: string;

  @ApiPropertyOptional({
    description: 'Estado activo del usuario',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiProperty({
    description: 'UUID del rol a asignar al usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  idRol: string;
}
