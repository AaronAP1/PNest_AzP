import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { AssignPrivilegiosDto } from './dto/assign-privilegios.dto';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('PPP_AUTH_HOST');
    const port = this.configService.get<number>('PPP_AUTH_PORT');
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    
    this.authServiceUrl = isProduction 
      ? `https://${host}` 
      : `http://${host}:${port}`;
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo rol', description: 'Registra un nuevo rol en el sistema' })
  @ApiBody({ type: CreateRolDto })
  @ApiResponse({ status: 201, description: 'Rol creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Body() createRolDto: CreateRolDto): Observable<any> {
    return this.httpService
      .post(`${this.authServiceUrl}/roles`, createRolDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los roles', description: 'Obtiene la lista completa de roles disponibles en el sistema' })
  @ApiResponse({ status: 200, description: 'Lista de roles obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/roles`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener rol por ID', description: 'Busca un rol específico por su UUID, incluyendo los usuarios asociados' })
  @ApiParam({ name: 'id', description: 'UUID del rol', type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Rol encontrado' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/roles/${id}`)
      .pipe(map((response) => response.data));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar rol', description: 'Actualiza la información de un rol' })
  @ApiParam({ name: 'id', description: 'UUID del rol', type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiBody({ type: UpdateRolDto })
  @ApiResponse({ status: 200, description: 'Rol actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  update(@Param('id') id: string, @Body() updateRolDto: UpdateRolDto): Observable<any> {
    return this.httpService
      .patch(`${this.authServiceUrl}/roles/${id}`, updateRolDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar rol', description: 'Elimina un rol del sistema' })
  @ApiParam({ name: 'id', description: 'UUID del rol', type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Rol eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar el rol porque tiene usuarios asociados' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService
      .delete(`${this.authServiceUrl}/roles/${id}`)
      .pipe(map((response) => response.data));
  }

  // ==========================================
  // ENDPOINTS PARA GESTIÓN DE PRIVILEGIOS
  // ==========================================

  @Post(':id/privilegios')
  @ApiOperation({ summary: 'Asignar privilegios a un rol', description: 'Asigna uno o más privilegios a un rol específico' })
  @ApiParam({ name: 'id', description: 'UUID del rol', type: 'string' })
  @ApiBody({ type: AssignPrivilegiosDto })
  @ApiResponse({ status: 200, description: 'Privilegios asignados correctamente' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  assignPrivilegios(
    @Param('id') id: string,
    @Body() assignPrivilegiosDto: AssignPrivilegiosDto,
  ): Observable<any> {
    return this.httpService
      .post(`${this.authServiceUrl}/roles/${id}/privilegios`, assignPrivilegiosDto)
      .pipe(map((response) => response.data));
  }

  @Get(':id/privilegios')
  @ApiOperation({ summary: 'Obtener privilegios de un rol', description: 'Lista todos los privilegios asignados a un rol' })
  @ApiParam({ name: 'id', description: 'UUID del rol', type: 'string' })
  @ApiResponse({ status: 200, description: 'Lista de privilegios del rol' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  getPrivilegios(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/roles/${id}/privilegios`)
      .pipe(map((response) => response.data));
  }

  @Delete(':id/privilegios/:privilegioId')
  @ApiOperation({ summary: 'Remover un privilegio de un rol', description: 'Elimina la asignación de un privilegio específico de un rol' })
  @ApiParam({ name: 'id', description: 'UUID del rol', type: 'string' })
  @ApiParam({ name: 'privilegioId', description: 'UUID del privilegio a remover', type: 'string' })
  @ApiResponse({ status: 204, description: 'Privilegio removido del rol' })
  @ApiResponse({ status: 404, description: 'Rol o privilegio no encontrado' })
  removePrivilegio(
    @Param('id') id: string,
    @Param('privilegioId') privilegioId: string,
  ): Observable<any> {
    return this.httpService
      .delete(`${this.authServiceUrl}/roles/${id}/privilegios/${privilegioId}`)
      .pipe(map((response) => response.data));
  }
}
