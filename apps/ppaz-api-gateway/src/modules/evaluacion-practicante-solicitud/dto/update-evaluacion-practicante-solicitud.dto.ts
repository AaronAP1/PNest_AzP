import { PartialType } from '@nestjs/swagger';
import { CreateEvaluacionPracticanteSolicitudDto } from './create-evaluacion-practicante-solicitud.dto';

export class UpdateEvaluacionPracticanteSolicitudDto extends PartialType(CreateEvaluacionPracticanteSolicitudDto) {}
