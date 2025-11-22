import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateSupervisorDto {
  @ApiProperty({
    description: 'UUID del usuario asociado al supervisor',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  usuarioId: string;

  @ApiProperty({
    description: 'UUID de la escuela a la que pertenece el supervisor',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsNotEmpty()
  @IsUUID()
  idEscuela: string;
}
