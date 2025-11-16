import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreatePreguntaDto {
  @IsString()
  preguntas: string;

  @IsBoolean()
  @IsOptional()
  estado?: boolean;
}
