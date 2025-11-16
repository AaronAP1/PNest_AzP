import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DimensionTransversalService } from './dimension-transversal.service';
import { CreateDimensionTransversalDto } from './dto/create-dimension-transversal.dto';
import { UpdateDimensionTransversalDto } from './dto/update-dimension-transversal.dto';

@Controller('dimension-transversal')
export class DimensionTransversalController {
  constructor(private readonly dimensionTransversalService: DimensionTransversalService) {}

  @MessagePattern({ cmd: 'create-dimension-transversal' })
  create(@Payload() createDto: CreateDimensionTransversalDto) {
    return this.dimensionTransversalService.create(createDto);
  }

  @MessagePattern({ cmd: 'find-all-dimensiones-transversales' })
  findAll() {
    return this.dimensionTransversalService.findAll();
  }

  @MessagePattern({ cmd: 'find-dimensiones-transversales-activas' })
  findAllActivas() {
    return this.dimensionTransversalService.findAllActivas();
  }

  @MessagePattern({ cmd: 'find-one-dimension-transversal' })
  findOne(@Payload() id: string) {
    return this.dimensionTransversalService.findOne(id);
  }

  @MessagePattern({ cmd: 'update-dimension-transversal' })
  update(@Payload() payload: { id: string; updateDto: UpdateDimensionTransversalDto }) {
    return this.dimensionTransversalService.update(payload.id, payload.updateDto);
  }

  @MessagePattern({ cmd: 'remove-dimension-transversal' })
  remove(@Payload() id: string) {
    return this.dimensionTransversalService.remove(id);
  }
}
