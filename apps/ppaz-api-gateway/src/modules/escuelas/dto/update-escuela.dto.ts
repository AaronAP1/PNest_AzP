import { PartialType } from '@nestjs/swagger';
import { CreateEscuelaDto } from './create-escuela.dto';

export class UpdateEscuelaDto extends PartialType(CreateEscuelaDto) {}
