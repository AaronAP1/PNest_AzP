import { PartialType } from '@nestjs/swagger';
import { CreatePreguntaLineaDto } from './create-pregunta-linea.dto';

export class UpdatePreguntaLineaDto extends PartialType(CreatePreguntaLineaDto) {}
