import { IsUUID, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateEvaluacionSupervisorDto {
  @IsUUID()
  idSupervisor: string;

  @IsUUID()
  idAlumno: string;

  @IsString()
  @IsOptional()
  comentario?: string;

  @IsBoolean()
  @IsOptional()
  estado?: boolean;
}
