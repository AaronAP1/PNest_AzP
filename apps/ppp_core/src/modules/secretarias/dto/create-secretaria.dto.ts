import { IsString, MaxLength, IsUUID } from 'class-validator';

export class CreateSecretariaDto {
  @IsUUID()
  usuarioId: string;

  @IsUUID()
  idEscuela: string;
}
