import { IsString, MaxLength, IsUUID } from 'class-validator';

export class CreateAlumnoDto {
  @IsUUID()
  usuarioId: string;

  @IsUUID()
  idEscuela: string;

  @IsString()
  @MaxLength(30)
  codigo: string;

  @IsString()
  @MaxLength(10)
  ciclo: string;

  @IsString()
  @MaxLength(4)
  año: string;
}
