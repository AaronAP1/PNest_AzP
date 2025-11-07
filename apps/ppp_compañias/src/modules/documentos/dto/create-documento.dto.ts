import { IsString, IsOptional, MaxLength, IsUUID } from 'class-validator';

export class CreateDocumentoDto {
  @IsUUID()
  idTipoDocumento: string;

  @IsString()
  @MaxLength(255)
  nombreArchivo: string;

  @IsString()
  rutaArchivo: string;

  @IsOptional()
  @IsUUID()
  subidoPor?: string;

  @IsOptional()
  @IsUUID()
  generadoPor?: string;
}
