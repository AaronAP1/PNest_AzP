import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateEvaluacionSupervisorDto {
  @ApiProperty({
    description: 'UUID del supervisor',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  idSupervisor: string;

  @ApiProperty({
    description: 'UUID del alumno',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsNotEmpty()
  @IsUUID()
  idAlumno: string;

  @ApiPropertyOptional({
    description: 'Comentarios adicionales sobre la evaluación',
    example: 'El estudiante mostró excelente desempeño en todas las áreas',
  })
  @IsOptional()
  @IsString()
  comentario?: string;
}
