import { PartialType } from '@nestjs/mapped-types';
import { CreatePreguntaLineaDto } from './create-pregunta-linea.dto';

export class UpdatePreguntaLineaDto extends PartialType(CreatePreguntaLineaDto) {}
