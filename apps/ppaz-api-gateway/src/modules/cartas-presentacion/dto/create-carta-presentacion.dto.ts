import { IsString, IsUUID, IsOptional, IsDateString, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum CartaEstado {
  draft = 'draft',
  submitted = 'submitted',
  reviewing = 'reviewing',
  approved = 'approved',
  rejected = 'rejected',
  cancelled = 'cancelled'
}

export class CreateCartaPresentacionDto {
  @ApiProperty({ 
    description: 'UUID del alumno solicitante', 
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  idAlumno: string;

  @ApiProperty({ 
    description: 'UUID de la empresa destino', 
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @IsUUID()
  idEmpresa: string;

  @ApiPropertyOptional({ 
    description: 'UUID de la secretaria que gestiona (opcional)', 
    example: '550e8400-e29b-41d4-a716-446655440002'
  })
  @IsOptional()
  @IsUUID()
  idSecretaria?: string;

  @ApiPropertyOptional({ 
    description: 'UUID del documento generado (opcional)', 
    example: '550e8400-e29b-41d4-a716-446655440003'
  })
  @IsOptional()
  @IsUUID()
  documentoId?: string;

  @ApiPropertyOptional({ 
    description: 'Área de práctica o departamento', 
    example: 'Desarrollo de Software',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  areaPractica?: string;

  @ApiProperty({ 
    description: 'Fecha de inicio de las prácticas (formato ISO 8601)', 
    example: '2025-03-01'
  })
  @IsDateString()
  fechaInicio: string;

  @ApiPropertyOptional({ 
    description: 'Motivo de rechazo (si aplica)', 
    example: 'Falta documentación adicional'
  })
  @IsOptional()
  @IsString()
  motivoRechazo?: string;

  @ApiPropertyOptional({ 
    description: 'Estado de la carta', 
    enum: CartaEstado,
    example: 'draft'
  })
  @IsOptional()
  @IsEnum(CartaEstado)
  estado?: CartaEstado;
}
