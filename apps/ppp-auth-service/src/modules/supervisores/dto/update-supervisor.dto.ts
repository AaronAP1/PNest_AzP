import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateSupervisorDto } from './create-supervisor.dto';

export class UpdateSupervisorDto extends PartialType(
  OmitType(CreateSupervisorDto, ['usuarioId'] as const)
) {}
