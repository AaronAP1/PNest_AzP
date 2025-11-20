import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCoordinadorDto } from './create-coordinador.dto';

export class UpdateCoordinadorDto extends PartialType(
  OmitType(CreateCoordinadorDto, ['usuarioId'] as const)
) {}
