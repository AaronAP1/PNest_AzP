import { PartialType } from '@nestjs/mapped-types';
import { CreateEvaluacionPracticanteDto } from './create-evaluacion-practicante.dto';

export class UpdateEvaluacionPracticanteDto extends PartialType(CreateEvaluacionPracticanteDto) {}
