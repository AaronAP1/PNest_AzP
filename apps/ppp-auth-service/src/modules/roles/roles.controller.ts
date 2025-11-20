import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { AssignPrivilegiosDto } from './dto/assign-privilegios.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @ApiResponse({ status: 201, description: 'Rol creado exitosamente' })
  @MessagePattern('roles.create')
  create(@Body() @Payload() createRolDto: CreateRolDto) {
    return this.rolesService.create(createRolDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los roles' })
  @ApiResponse({ status: 200, description: 'Lista de roles' })
  @MessagePattern('roles.findAll')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  @ApiResponse({ status: 200, description: 'Rol encontrado' })
  @MessagePattern('roles.findOne')
  findOne(@Param('id') @Payload() id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un rol' })
  @ApiResponse({ status: 200, description: 'Rol actualizado' })
  @MessagePattern('roles.update')
  update(@Param('id') id: string, @Body() @Payload() updateRolDto: UpdateRolDto) {
    return this.rolesService.update(id, updateRolDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un rol' })
  @ApiResponse({ status: 204, description: 'Rol eliminado' })
  @MessagePattern('roles.remove')
  remove(@Param('id') @Payload() id: string) {
    return this.rolesService.remove(id);
  }

  // ==========================================
  // ENDPOINTS PARA GESTIÓN DE PRIVILEGIOS
  // ==========================================

  @Post(':id/privilegios')
  @ApiOperation({ summary: 'Asignar privilegios a un rol' })
  @ApiResponse({ status: 200, description: 'Privilegios asignados correctamente' })
  assignPrivilegios(
    @Param('id') id: string,
    @Body() assignPrivilegiosDto: AssignPrivilegiosDto,
  ) {
    return this.rolesService.assignPrivilegios(id, assignPrivilegiosDto.privilegiosIds);
  }

  @Get(':id/privilegios')
  @ApiOperation({ summary: 'Obtener privilegios de un rol' })
  @ApiResponse({ status: 200, description: 'Lista de privilegios del rol' })
  getPrivilegios(@Param('id') id: string) {
    return this.rolesService.getPrivilegios(id);
  }

  @Delete(':id/privilegios/:privilegioId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover un privilegio de un rol' })
  @ApiResponse({ status: 204, description: 'Privilegio removido del rol' })
  removePrivilegio(
    @Param('id') id: string,
    @Param('privilegioId') privilegioId: string,
  ) {
    return this.rolesService.removePrivilegio(id, privilegioId);
  }
}
