import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @MessagePattern('usuarios.create')
  create(@Body() @Payload() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @MessagePattern('usuarios.findAll')
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @MessagePattern('usuarios.findOne')
  findOne(@Param('id') @Payload() id: string) {
    return this.usuariosService.findOne(id);
  }

  @Get('email/:email')
  @MessagePattern('usuarios.findByEmail')
  findByEmail(@Param('email') @Payload() email: string) {
    return this.usuariosService.findByEmail(email);
  }

  @Patch(':id')
  @MessagePattern('usuarios.update')
  update(@Param('id') id: string, @Body() @Payload() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @MessagePattern('usuarios.remove')
  remove(@Param('id') @Payload() id: string) {
    return this.usuariosService.remove(id);
  }

  @Post(':id/roles')
  @MessagePattern('usuarios.assignRoles')
  assignRoles(@Param('id') usuarioId: string, @Body() @Payload() rolesData: { rolesIds: string[] }) {
    return this.usuariosService.assignRoles(usuarioId, rolesData.rolesIds);
  }
}
