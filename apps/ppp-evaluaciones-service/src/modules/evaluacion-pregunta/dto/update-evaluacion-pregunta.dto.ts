import { PartialType } from '@nestjs/mapped-types';
import { CreateEvaluacionPreguntaDto } from './create-evaluacion-pregunta.dto';

export class UpdateEvaluacionPreguntaDto extends PartialType(CreateEvaluacionPreguntaDto) {}
