import { IsString, IsUUID } from 'class-validator';

export class CreateSupervisorDto {
  @IsUUID()
  usuarioId: string;

  @IsUUID()
  idEscuela: string;
}
