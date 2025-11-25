import { PartialType } from '@nestjs/swagger';
import { CreateCoordinadorDto } from './create-coordinador.dto';

export class UpdateCoordinadorDto extends PartialType(CreateCoordinadorDto) {}
