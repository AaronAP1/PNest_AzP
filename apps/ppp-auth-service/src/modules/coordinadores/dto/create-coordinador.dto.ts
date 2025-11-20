import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCoordinadorDto {
  @ApiProperty({
    description: 'ID del usuario asociado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El usuario ID es obligatorio' })
  @IsUUID('4', { message: 'El usuario ID debe ser un UUID válido' })
  usuarioId: string;

  @ApiProperty({
    description: 'ID de la escuela profesional',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty({ message: 'El ID de escuela es obligatorio' })
  @IsUUID('4', { message: 'El ID de escuela debe ser un UUID válido' })
  idEscuela: string;
}
