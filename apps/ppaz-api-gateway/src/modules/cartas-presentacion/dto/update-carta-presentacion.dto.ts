import { PartialType } from '@nestjs/swagger';
import { CreateCartaPresentacionDto } from './create-carta-presentacion.dto';

export class UpdateCartaPresentacionDto extends PartialType(CreateCartaPresentacionDto) {}
