import { IsUUID, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateEvaluacionPreguntaDto {
  @IsUUID()
  idEvaluacion: string;

  @IsUUID()
  idPregunta: string;

  @IsString()
  valor: string;

  @IsBoolean()
  @IsOptional()
  estado?: boolean;
}
