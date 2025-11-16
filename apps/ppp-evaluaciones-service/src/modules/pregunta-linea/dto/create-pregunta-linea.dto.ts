import { IsUUID, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreatePreguntaLineaDto {
  @IsUUID()
  idLineaFacultad: string;

  @IsUUID()
  idEvaluacionPracticante: string;

  @IsString()
  preguntas: string;

  @IsBoolean()
  @IsOptional()
  estado?: boolean;
}
