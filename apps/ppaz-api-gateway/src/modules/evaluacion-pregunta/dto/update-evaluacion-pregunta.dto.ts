import { PartialType } from '@nestjs/swagger';
import { CreateEvaluacionPreguntaDto } from './create-evaluacion-pregunta.dto';

export class UpdateEvaluacionPreguntaDto extends PartialType(CreateEvaluacionPreguntaDto) {}
