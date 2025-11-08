import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTipoDocumentoDto {
  @ApiProperty({ description: 'Nombre del tipo de documento', example: 'Carta de Presentación' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Descripción del tipo de documento', example: 'Documento formal de presentación del estudiante', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;
}
