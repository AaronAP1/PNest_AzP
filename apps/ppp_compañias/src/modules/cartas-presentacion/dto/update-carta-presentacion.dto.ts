import { PartialType } from '@nestjs/mapped-types';
import { CreateCartaPresentacionDto } from './create-carta-presentacion.dto';

export class UpdateCartaPresentacionDto extends PartialType(CreateCartaPresentacionDto) {}
