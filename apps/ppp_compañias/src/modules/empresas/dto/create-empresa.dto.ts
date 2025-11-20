import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, Length, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateEmpresaDto {
  @ApiProperty({
    description: 'Razón social de la empresa',
    example: 'Tecnología y Soluciones SAC',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'El nombre de la empresa es obligatorio' })
  @IsString()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({
    description: 'Nombre completo del representante legal',
    example: 'Juan Pérez García',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'El nombre del representante es obligatorio' })
  @IsString()
  @MaxLength(255)
  nombreRepresentante: string;

  @ApiProperty({
    description: 'RUC de la empresa (11 dígitos)',
    example: '20123456789',
    minLength: 11,
    maxLength: 11,
  })
  @IsNotEmpty({ message: 'El RUC es obligatorio' })
  @IsString()
  @Length(11, 11, { message: 'El RUC debe tener exactamente 11 dígitos' })
  ruc: string;

  @ApiProperty({
    description: 'Sector económico de la empresa',
    example: 'Tecnología',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'El sector es obligatorio' })
  @IsString()
  @MaxLength(100)
  sector: string;

  @ApiProperty({
    description: 'Grado académico del representante',
    example: 'Ingeniero',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'El grado académico es obligatorio' })
  @IsString()
  @MaxLength(100)
  gradoAcademico: string;

  @ApiProperty({
    description: 'Cargo del representante en la empresa',
    example: 'Gerente General',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'El cargo del representante es obligatorio' })
  @IsString()
  @MaxLength(100)
  cargoRepresentante: string;

  @ApiProperty({
    description: 'Teléfono de contacto',
    example: '987654321',
    maxLength: 15,
  })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @IsString()
  @MaxLength(15)
  telefono: string;

  @ApiProperty({
    description: 'Dirección completa de la empresa',
    example: 'Av. Perú 123, Lima, Lima',
  })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @IsString()
  direccion: string;
}
