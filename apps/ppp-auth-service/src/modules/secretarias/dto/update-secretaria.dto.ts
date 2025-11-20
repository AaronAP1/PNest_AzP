import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateSecretariaDto } from './create-secretaria.dto';

export class UpdateSecretariaDto extends PartialType(
  OmitType(CreateSecretariaDto, ['usuarioId'] as const)
) {}
