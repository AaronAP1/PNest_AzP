import { Controller, Get, Post, Body, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CreateRolDto } from './dto/create-rol.dto';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(
    @Inject('PPP_CORE_SERVICE') private readonly coreClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo rol', description: 'Registra un nuevo rol en el sistema' })
  @ApiBody({ type: CreateRolDto })
  @ApiResponse({ status: 201, description: 'Rol creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Body() createRolDto: CreateRolDto): Observable<any> {
    return this.coreClient.send({ cmd: 'create_rol' }, createRolDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los roles', description: 'Obtiene la lista completa de roles disponibles en el sistema' })
  @ApiResponse({ status: 200, description: 'Lista de roles obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.coreClient.send({ cmd: 'find_all_roles' }, {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener rol por ID', description: 'Busca un rol específico por su UUID, incluyendo los usuarios asociados' })
  @ApiParam({ name: 'id', description: 'UUID del rol', type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Rol encontrado' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.coreClient.send({ cmd: 'find_one_rol' }, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar rol', description: 'Elimina un rol del sistema' })
  @ApiParam({ name: 'id', description: 'UUID del rol', type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Rol eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar el rol porque tiene usuarios asociados' })
  remove(@Param('id') id: string): Observable<any> {
    return this.coreClient.send({ cmd: 'remove_rol' }, id);
  }
}
