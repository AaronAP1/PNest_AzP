import { IsUUID, IsString } from 'class-validator';

export class CreateEvaluacionPracticanteSolicitudDto {
  @IsUUID()
  idDimensionTransversal: string;

  @IsUUID()
  idEvaluacionPracticante: string;

  @IsString()
  valor: string;
}
