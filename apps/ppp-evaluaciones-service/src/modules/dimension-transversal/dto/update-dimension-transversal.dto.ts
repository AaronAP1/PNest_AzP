import { PartialType } from '@nestjs/mapped-types';
import { CreateDimensionTransversalDto } from './create-dimension-transversal.dto';

export class UpdateDimensionTransversalDto extends PartialType(CreateDimensionTransversalDto) {}
