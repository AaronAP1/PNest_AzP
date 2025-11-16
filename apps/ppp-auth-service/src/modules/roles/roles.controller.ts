import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @MessagePattern('roles.create')
  create(@Body() @Payload() createRolDto: CreateRolDto) {
    return this.rolesService.create(createRolDto);
  }

  @Get()
  @MessagePattern('roles.findAll')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @MessagePattern('roles.findOne')
  findOne(@Param('id') @Payload() id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @MessagePattern('roles.update')
  update(@Param('id') id: string, @Body() @Payload() updateRolDto: UpdateRolDto) {
    return this.rolesService.update(id, updateRolDto);
  }

  @Delete(':id')
  @MessagePattern('roles.remove')
  remove(@Param('id') @Payload() id: string) {
    return this.rolesService.remove(id);
  }
}
