import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateRolDto } from './dto/create-rol.dto';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  private readonly coreServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('PPP_CORE_HOST');
    const port = this.configService.get<number>('PPP_CORE_PORT');
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    
    this.coreServiceUrl = isProduction 
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
      .post(`${this.coreServiceUrl}/roles`, createRolDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los roles', description: 'Obtiene la lista completa de roles disponibles en el sistema' })
  @ApiResponse({ status: 200, description: 'Lista de roles obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.coreServiceUrl}/roles`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener rol por ID', description: 'Busca un rol específico por su UUID, incluyendo los usuarios asociados' })
  @ApiParam({ name: 'id', description: 'UUID del rol', type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Rol encontrado' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`${this.coreServiceUrl}/roles/${id}`)
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
      .delete(`${this.coreServiceUrl}/roles/${id}`)
      .pipe(map((response) => response.data));
  }
}
