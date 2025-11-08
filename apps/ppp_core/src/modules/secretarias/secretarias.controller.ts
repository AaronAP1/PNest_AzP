import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SecretariasService } from './secretarias.service';
import { CreateSecretariaDto } from './dto/create-secretaria.dto';
import { UpdateSecretariaDto } from './dto/update-secretaria.dto';

@Controller('secretarias')
export class SecretariasController {
  constructor(private readonly secretariasService: SecretariasService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  createHttp(@Body() createSecretariaDto: CreateSecretariaDto) {
    return this.secretariasService.create(createSecretariaDto);
  }

  @Get()
  findAllHttp() {
    return this.secretariasService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.secretariasService.findOne(id);
  }

  @Get('escuela/:idEscuela')
  findByEscuelaHttp(@Param('idEscuela') idEscuela: string) {
    return this.secretariasService.findByEscuela(idEscuela);
  }

  @Patch(':id')
  updateHttp(@Param('id') id: string, @Body() updateSecretariaDto: UpdateSecretariaDto) {
    return this.secretariasService.update(id, updateSecretariaDto);
  }

  @Delete(':id')
  removeHttp(@Param('id') id: string) {
    return this.secretariasService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create_secretaria' })
  create(@Payload() createSecretariaDto: CreateSecretariaDto) {
    return this.secretariasService.create(createSecretariaDto);
  }

  @MessagePattern({ cmd: 'find_all_secretarias' })
  findAll() {
    return this.secretariasService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_secretaria' })
  findOne(@Payload() id: string) {
    return this.secretariasService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_secretarias_by_escuela' })
  findByEscuela(@Payload() idEscuela: string) {
    return this.secretariasService.findByEscuela(idEscuela);
  }

  @MessagePattern({ cmd: 'update_secretaria' })
  update(@Payload() payload: { id: string; data: UpdateSecretariaDto }) {
    return this.secretariasService.update(payload.id, payload.data);
  }

  @MessagePattern({ cmd: 'remove_secretaria' })
  remove(@Payload() id: string) {
    return this.secretariasService.remove(id);
  }
}
