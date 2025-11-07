import { IsString, MaxLength, IsUUID } from 'class-validator';

export class CreateSecretariaDto {
  @IsString()
  @MaxLength(255)
  nombre: string;

  @IsUUID()
  idEscuela: string;
}
