import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAlumnoDto } from './create-alumno.dto';

export class UpdateAlumnoDto extends PartialType(
  OmitType(CreateAlumnoDto, ['usuarioId'] as const)
) {}
