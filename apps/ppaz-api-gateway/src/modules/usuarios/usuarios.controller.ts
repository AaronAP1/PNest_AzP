import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(
    @Inject('PPP_CORE_SERVICE') private readonly coreClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario', description: 'Registra un nuevo usuario en el sistema con roles asignados' })
  @ApiBody({ type: CreateUsuarioDto })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Body() createUsuarioDto: CreateUsuarioDto): Observable<any> {
    return this.coreClient.send({ cmd: 'create_usuario' }, createUsuarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios', description: 'Obtiene la lista completa de usuarios con sus roles' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.coreClient.send({ cmd: 'find_all_usuarios' }, {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID', description: 'Busca un usuario específico por su UUID' })
  @ApiParam({ name: 'id', description: 'UUID del usuario', type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.coreClient.send({ cmd: 'find_one_usuario' }, id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Buscar usuario por email', description: 'Busca un usuario utilizando su dirección de correo electrónico' })
  @ApiParam({ name: 'email', description: 'Email del usuario', type: 'string', example: 'juan.perez@upeu.edu.pe' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findByEmail(@Param('email') email: string): Observable<any> {
    return this.coreClient.send({ cmd: 'find_usuario_by_email' }, email);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario', description: 'Actualiza los datos de un usuario existente' })
  @ApiParam({ name: 'id', description: 'UUID del usuario', type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiBody({ type: UpdateUsuarioDto })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Observable<any> {
    return this.coreClient.send(
      { cmd: 'update_usuario' },
      { id, data: updateUsuarioDto },
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario', description: 'Elimina un usuario del sistema' })
  @ApiParam({ name: 'id', description: 'UUID del usuario', type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id') id: string): Observable<any> {
    return this.coreClient.send({ cmd: 'remove_usuario' }, id);
  }
}
