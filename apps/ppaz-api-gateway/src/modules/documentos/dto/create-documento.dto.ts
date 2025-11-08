import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class CreateDocumentoDto {
  @ApiProperty({ description: 'ID del tipo de documento', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  idTipoDocumento: string;

  @ApiProperty({ description: 'Nombre del archivo', example: 'Carta_Presentacion_Juan_Perez.pdf' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombreArchivo: string;

  @ApiProperty({ description: 'Ruta o URL del documento', example: '/uploads/documentos/carta_123.pdf' })
  @IsString()
  @IsNotEmpty()
  rutaArchivo: string;

  @ApiProperty({ description: 'ID del usuario que subió el documento', example: '550e8400-e29b-41d4-a716-446655440001', required: false })
  @IsUUID()
  @IsOptional()
  subidoPor?: string;

  @ApiProperty({ description: 'ID del usuario que generó el documento', example: '550e8400-e29b-41d4-a716-446655440002', required: false })
  @IsUUID()
  @IsOptional()
  generadoPor?: string;
}
