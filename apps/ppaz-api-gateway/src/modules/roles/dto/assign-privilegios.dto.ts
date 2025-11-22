import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class AssignPrivilegiosDto {
  @ApiProperty({
    description: 'Array de IDs de privilegios a asignar al rol',
    example: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'Debe proporcionar al menos un privilegio' })
  @IsUUID('4', { each: true, message: 'Cada privilegio ID debe ser un UUID válido' })
  privilegiosIds: string[];
}
