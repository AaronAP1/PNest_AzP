import { PartialType } from '@nestjs/mapped-types';
import { CreateLineaFacultadDto } from './create-linea-facultad.dto';

export class UpdateLineaFacultadDto extends PartialType(CreateLineaFacultadDto) {}
