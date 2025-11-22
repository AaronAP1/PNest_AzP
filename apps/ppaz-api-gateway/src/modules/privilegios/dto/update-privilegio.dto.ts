import { PartialType } from '@nestjs/swagger';
import { CreatePrivilegioDto } from './create-privilegio.dto';

export class UpdatePrivilegioDto extends PartialType(CreatePrivilegioDto) {}
