import { PartialType } from '@nestjs/swagger';
import { CreateEvaluacionPracticanteDto } from './create-evaluacion-practicante.dto';

export class UpdateEvaluacionPracticanteDto extends PartialType(CreateEvaluacionPracticanteDto) {}
