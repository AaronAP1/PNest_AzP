import { IsUUID } from 'class-validator';

export class CreateCoordinadorDto {
  @IsUUID()
  usuarioId: string;

  @IsUUID()
  idEscuela: string;
}
