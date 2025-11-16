import { PartialType } from '@nestjs/mapped-types';
import { CreateSolicitudPppDto } from './create-solicitud-ppp.dto';

export class UpdateSolicitudPppDto extends PartialType(CreateSolicitudPppDto) {}
