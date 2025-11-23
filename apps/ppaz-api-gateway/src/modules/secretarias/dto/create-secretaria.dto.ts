import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSecretariaDto {
  @ApiProperty({ 
    description: 'UUID del usuario asociado', 
    example: '1d10096a-6b60-41c7-83e1-28abe6842dc1'
  })
  @IsNotEmpty()
  @IsUUID()
  usuarioId: string;

  @ApiProperty({ 
    description: 'UUID de la escuela a la que pertenece', 
    example: '11111111-aaaa-aaaa-aaaa-111111111111'
  })
  @IsNotEmpty()
  @IsUUID()
  idEscuela: string;
}
