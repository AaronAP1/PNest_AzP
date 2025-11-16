import { PartialType } from '@nestjs/mapped-types';
import { CreateEvaluacionSupervisorDto } from './create-evaluacion-supervisor.dto';

export class UpdateEvaluacionSupervisorDto extends PartialType(CreateEvaluacionSupervisorDto) {}
