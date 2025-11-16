import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateFacultadDto } from './dto/create-facultad.dto';
import { UpdateFacultadDto } from './dto/update-facultad.dto';

@ApiTags('facultades')
@Controller('facultades')
export class FacultadesController {
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
    
    // DEBUG: Log para verificar configuración
    console.log('🔍 [FacultadesController] PPP_CORE_HOST:', host);
    console.log('🔍 [FacultadesController] PPP_CORE_PORT:', port);
    console.log('🔍 [FacultadesController] coreServiceUrl:', this.coreServiceUrl);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva facultad', description: 'Registra una nueva facultad en el sistema' })
  @ApiBody({ type: CreateFacultadDto })
  @ApiResponse({ status: 201, description: 'Facultad creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe una facultad con ese código' })
  create(@Body() createFacultadDto: CreateFacultadDto): Observable<any> {
    return this.httpService
      .post(`${this.coreServiceUrl}/facultades`, createFacultadDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las facultades', description: 'Obtiene la lista completa de facultades con el conteo de escuelas' })
  @ApiResponse({ status: 200, description: 'Lista de facultades obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.coreServiceUrl}/facultades`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener facultad por ID', description: 'Busca una facultad específica por su UUID' })
  @ApiParam({ name: 'id', description: 'UUID de la facultad', type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Facultad encontrada' })
  @ApiResponse({ status: 404, description: 'Facultad no encontrada' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`${this.coreServiceUrl}/facultades/${id}`)
      .pipe(map((response) => response.data));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar facultad', description: 'Actualiza los datos de una facultad existente' })
  @ApiParam({ name: 'id', description: 'UUID de la facultad', type: 'string' })
  @ApiBody({ type: UpdateFacultadDto })
  @ApiResponse({ status: 200, description: 'Facultad actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Facultad no encontrada' })
  @ApiResponse({ status: 409, description: 'Ya existe una facultad con ese código' })
  update(@Param('id') id: string, @Body() updateFacultadDto: UpdateFacultadDto): Observable<any> {
    return this.httpService
      .patch(`${this.coreServiceUrl}/facultades/${id}`, updateFacultadDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar facultad', description: 'Elimina una facultad del sistema (solo si no tiene escuelas asociadas)' })
  @ApiParam({ name: 'id', description: 'UUID de la facultad', type: 'string' })
  @ApiResponse({ status: 200, description: 'Facultad eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Facultad no encontrada' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar la facultad porque tiene escuelas asociadas' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService
      .delete(`${this.coreServiceUrl}/facultades/${id}`)
      .pipe(map((response) => response.data));
  }
}
