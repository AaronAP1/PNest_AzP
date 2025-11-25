import { PartialType } from '@nestjs/swagger';
import { CreateSolicitudPppDto } from './create-solicitud-ppp.dto';

export class UpdateSolicitudPppDto extends PartialType(CreateSolicitudPppDto) {}
