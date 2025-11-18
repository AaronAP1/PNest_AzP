import { IsString, IsEmail, IsOptional, IsBoolean, IsArray, IsUUID, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ 
    description: 'Nombres del usuario', 
    example: 'Juan Carlos',
    minLength: 2,
    maxLength: 120
  })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nombres: string;

  @ApiProperty({ 
    description: 'Apellidos del usuario', 
    example: 'Pérez García',
    minLength: 2,
    maxLength: 120
  })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  apellidos: string;

  @ApiProperty({ 
    description: 'Email del usuario', 
    example: 'juan.perez@upeu.edu.pe',
    maxLength: 150
  })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiPropertyOptional({ 
    description: 'Teléfono del usuario', 
    example: '987654321',
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiProperty({ 
    description: 'Contraseña del usuario', 
    example: 'Secure@Pass123',
    minLength: 6,
    maxLength: 255
  })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  contraseña: string;

  @ApiPropertyOptional({ 
    description: 'Estado activo del usuario', 
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ 
    description: 'IDs de los roles a asignar al usuario (relación many-to-many)',
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    type: [String],
    isArray: true
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  rolesIds?: string[];
}
