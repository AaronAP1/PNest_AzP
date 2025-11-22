import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateSolicitudPppDto {
  @ApiProperty({
    description: 'UUID del supervisor asignado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  idSupervisor: string;

  @ApiProperty({
    description: 'UUID del alumno solicitante',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsNotEmpty()
  @IsUUID()
  idAlumno: string;

  @ApiProperty({
    description: 'UUID de la empresa',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsNotEmpty()
  @IsUUID()
  idEmpresa: string;
}
