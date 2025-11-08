import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@ApiTags('empresas')
@Controller('empresas')
export class EmpresasController {
  private readonly companiasServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('PPP_COMPANIAS_HOST');
    const port = this.configService.get<number>('PPP_COMPANIAS_PORT');
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    this.companiasServiceUrl = isProduction ? `https://${host}` : `http://${host}:${port}`;
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva empresa', description: 'Registra una nueva empresa para prácticas profesionales' })
  @ApiBody({ type: CreateEmpresaDto })
  @ApiResponse({ status: 201, description: 'Empresa creada exitosamente' })
  @ApiResponse({ status: 409, description: 'Ya existe una empresa con ese RUC' })
  create(@Body() createEmpresaDto: CreateEmpresaDto): Observable<any> {
    return this.httpService.post(`${this.companiasServiceUrl}/empresas`, createEmpresaDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las empresas', description: 'Obtiene la lista completa de empresas registradas' })
  @ApiResponse({ status: 200, description: 'Lista de empresas obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService.get(`${this.companiasServiceUrl}/empresas`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener empresa por ID', description: 'Busca una empresa específica por su UUID' })
  @ApiParam({ name: 'id', description: 'UUID de la empresa', type: 'string' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService.get(`${this.companiasServiceUrl}/empresas/${id}`)
      .pipe(map((response) => response.data));
  }

  @Get('ruc/:ruc')
  @ApiOperation({ summary: 'Buscar empresa por RUC', description: 'Busca una empresa usando su número de RUC' })
  @ApiParam({ name: 'ruc', description: 'RUC de la empresa (11 dígitos)', type: 'string', example: '20123456789' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  findByRuc(@Param('ruc') ruc: string): Observable<any> {
    return this.httpService.get(`${this.companiasServiceUrl}/empresas/ruc/${ruc}`)
      .pipe(map((response) => response.data));
  }

  @Get('sector/:sector')
  @ApiOperation({ summary: 'Buscar empresas por sector', description: 'Obtiene empresas de un sector económico específico' })
  @ApiParam({ name: 'sector', description: 'Sector económico', type: 'string', example: 'Tecnología' })
  @ApiResponse({ status: 200, description: 'Lista de empresas obtenida' })
  findBySector(@Param('sector') sector: string): Observable<any> {
    return this.httpService.get(`${this.companiasServiceUrl}/empresas/sector/${sector}`)
      .pipe(map((response) => response.data));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar empresa', description: 'Actualiza los datos de una empresa existente' })
  @ApiParam({ name: 'id', description: 'UUID de la empresa', type: 'string' })
  @ApiBody({ type: UpdateEmpresaDto })
  @ApiResponse({ status: 200, description: 'Empresa actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  update(@Param('id') id: string, @Body() updateEmpresaDto: UpdateEmpresaDto): Observable<any> {
    return this.httpService.patch(`${this.companiasServiceUrl}/empresas/${id}`, updateEmpresaDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar empresa', description: 'Elimina una empresa (solo si no tiene cartas de presentación asociadas)' })
  @ApiParam({ name: 'id', description: 'UUID de la empresa', type: 'string' })
  @ApiResponse({ status: 200, description: 'Empresa eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar porque tiene cartas asociadas' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService.delete(`${this.companiasServiceUrl}/empresas/${id}`)
      .pipe(map((response) => response.data));
  }
}
