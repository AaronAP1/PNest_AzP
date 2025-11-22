import { PartialType } from '@nestjs/swagger';
import { CreateDimensionTransversalDto } from './create-dimension-transversal.dto';

export class UpdateDimensionTransversalDto extends PartialType(CreateDimensionTransversalDto) {}
