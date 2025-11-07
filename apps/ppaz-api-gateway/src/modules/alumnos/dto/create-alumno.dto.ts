import { IsString, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlumnoDto {
  @ApiProperty({ 
    description: 'UUID del usuario asociado al alumno', 
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  usuarioId: string;

  @ApiProperty({ 
    description: 'UUID de la escuela del alumno', 
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @IsUUID()
  idEscuela: string;

  @ApiProperty({ 
    description: 'Código único del alumno', 
    example: '2021001234',
    maxLength: 30
  })
  @IsString()
  @MaxLength(30)
  codigo: string;

  @ApiProperty({ 
    description: 'Ciclo académico del alumno', 
    example: 'VIII',
    maxLength: 10
  })
  @IsString()
  @MaxLength(10)
  ciclo: string;

  @ApiProperty({ 
    description: 'Año de ingreso', 
    example: '2021',
    maxLength: 4
  })
  @IsString()
  @MaxLength(4)
  año: string;
}
