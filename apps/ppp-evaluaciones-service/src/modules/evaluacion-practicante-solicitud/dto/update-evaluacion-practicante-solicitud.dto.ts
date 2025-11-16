import { PartialType } from '@nestjs/mapped-types';
import { CreateEvaluacionPracticanteSolicitudDto } from './create-evaluacion-practicante-solicitud.dto';

export class UpdateEvaluacionPracticanteSolicitudDto extends PartialType(CreateEvaluacionPracticanteSolicitudDto) {}
