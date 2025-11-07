import { IsString, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSecretariaDto {
  @ApiProperty({ 
    description: 'Nombre de la secretaria', 
    example: 'María González Pérez',
    maxLength: 255
  })
  @IsString()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({ 
    description: 'UUID de la escuela a la que pertenece', 
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  idEscuela: string;
}
