import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  createHttp(@Body() createRolDto: CreateRolDto) {
    return this.rolesService.create(createRolDto);
  }

  @Get()
  findAllHttp() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Delete(':id')
  removeHttp(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create_rol' })
  create(@Payload() createRolDto: CreateRolDto) {
    return this.rolesService.create(createRolDto);
  }

  @MessagePattern({ cmd: 'find_all_roles' })
  findAll() {
    return this.rolesService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_rol' })
  findOne(@Payload() id: string) {
    return this.rolesService.findOne(id);
  }

  @MessagePattern({ cmd: 'remove_rol' })
  remove(@Payload() id: string) {
    return this.rolesService.remove(id);
  }
}
