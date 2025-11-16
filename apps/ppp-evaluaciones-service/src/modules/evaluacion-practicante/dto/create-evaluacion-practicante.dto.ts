import { IsUUID, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateEvaluacionPracticanteDto {
  @IsUUID()
  idSolicitud: string;

  @IsString()
  @IsOptional()
  comentario?: string;

  @IsBoolean()
  @IsOptional()
  estado?: boolean;
}
