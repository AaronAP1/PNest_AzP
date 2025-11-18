import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioResponseDto } from './dto/usuario-response.dto';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @MessagePattern('usuarios.create')
  @ApiOperation({ summary: 'Crear un nuevo usuario con roles asignados' })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente',
    type: UsuarioResponseDto
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() @Payload() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @MessagePattern('usuarios.findAll')
  @ApiOperation({ summary: 'Listar todos los usuarios con sus roles' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios',
    type: [UsuarioResponseDto]
  })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @MessagePattern('usuarios.findOne')
  @ApiOperation({ summary: 'Obtener un usuario por ID con sus roles' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario encontrado',
    type: UsuarioResponseDto
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id') @Payload() id: string) {
    return this.usuariosService.findOne(id);
  }

  @Get('email/:email')
  @MessagePattern('usuarios.findByEmail')
  @ApiOperation({ summary: 'Buscar usuario por email' })
  @ApiParam({ name: 'email', description: 'Email del usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario encontrado',
    type: UsuarioResponseDto
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findByEmail(@Param('email') @Payload() email: string) {
    return this.usuariosService.findByEmail(email);
  }

  @Patch(':id')
  @MessagePattern('usuarios.update')
  @ApiOperation({ summary: 'Actualizar un usuario y sus roles' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario actualizado',
    type: UsuarioResponseDto
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(@Param('id') id: string, @Body() @Payload() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @MessagePattern('usuarios.remove')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id') @Payload() id: string) {
    return this.usuariosService.remove(id);
  }

  @Post(':id/roles')
  @MessagePattern('usuarios.assignRoles')
  @ApiOperation({ summary: 'Asignar roles a un usuario (relación many-to-many)' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        rolesIds: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          example: ['550e8400-e29b-41d4-a716-446655440000']
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Roles asignados exitosamente',
    type: UsuarioResponseDto
  })
  assignRoles(@Param('id') usuarioId: string, @Body() @Payload() rolesData: { rolesIds: string[] }) {
    return this.usuariosService.assignRoles(usuarioId, rolesData.rolesIds);
  }
}
