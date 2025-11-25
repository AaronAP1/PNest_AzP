import { PartialType } from '@nestjs/swagger';
import { CreateLineaFacultadDto } from './create-linea-facultad.dto';

export class UpdateLineaFacultadDto extends PartialType(CreateLineaFacultadDto) {}
