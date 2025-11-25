import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateReunionDto {
  @ApiProperty({
    description: 'UUID de la solicitud PPP asociada',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  idSolicitud: string;
}
