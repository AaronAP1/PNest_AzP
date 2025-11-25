import { PartialType } from '@nestjs/swagger';
import { CreateEvaluacionSupervisorDto } from './create-evaluacion-supervisor.dto';

export class UpdateEvaluacionSupervisorDto extends PartialType(CreateEvaluacionSupervisorDto) {}
