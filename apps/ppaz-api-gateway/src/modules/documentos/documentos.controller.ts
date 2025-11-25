import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';

@ApiTags('documentos')
@Controller('documentos')
export class DocumentosController {
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
  @ApiOperation({ summary: 'Crear documento', description: 'Registra un nuevo documento en el sistema' })
  @ApiBody({ type: CreateDocumentoDto })
  @ApiResponse({ status: 201, description: 'Documento creado exitosamente' })
  create(@Body() createDocumentoDto: CreateDocumentoDto): Observable<any> {
    return this.httpService.post(`${this.companiasServiceUrl}/documentos`, createDocumentoDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar documentos', description: 'Obtiene todos los documentos registrados' })
  @ApiResponse({ status: 200, description: 'Lista obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService.get(`${this.companiasServiceUrl}/documentos`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener documento por ID', description: 'Busca un documento por su UUID' })
  @ApiParam({ name: 'id', description: 'UUID del documento', type: 'string' })
  @ApiResponse({ status: 200, description: 'Documento encontrado' })
  @ApiResponse({ status: 404, description: 'Documento no encontrado' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService.get(`${this.companiasServiceUrl}/documentos/${id}`)
      .pipe(map((response) => response.data));
  }

  @Get('tipo/:idTipoDocumento')
  @ApiOperation({ summary: 'Buscar documentos por tipo', description: 'Obtiene documentos filtrados por tipo de documento' })
  @ApiParam({ name: 'idTipoDocumento', description: 'UUID del tipo de documento', type: 'string' })
  @ApiResponse({ status: 200, description: 'Lista de documentos obtenida' })
  findByTipo(@Param('idTipoDocumento') idTipoDocumento: string): Observable<any> {
    return this.httpService.get(`${this.companiasServiceUrl}/documentos/tipo/${idTipoDocumento}`)
      .pipe(map((response) => response.data));
  }

  @Get('subido-por/:subidoPor')
  @ApiOperation({ summary: 'Buscar documentos por usuario que subió', description: 'Obtiene documentos filtrados por el usuario que los subió' })
  @ApiParam({ name: 'subidoPor', description: 'UUID del usuario', type: 'string' })
  @ApiResponse({ status: 200, description: 'Lista de documentos obtenida' })
  findBySubidoPor(@Param('subidoPor') subidoPor: string): Observable<any> {
    return this.httpService.get(`${this.companiasServiceUrl}/documentos/subido-por/${subidoPor}`)
      .pipe(map((response) => response.data));
  }

  @Get('generado-por/:generadoPor')
  @ApiOperation({ summary: 'Buscar documentos por usuario generador', description: 'Obtiene documentos filtrados por el usuario que los generó' })
  @ApiParam({ name: 'generadoPor', description: 'UUID del usuario', type: 'string' })
  @ApiResponse({ status: 200, description: 'Lista de documentos obtenida' })
  findByGeneradoPor(@Param('generadoPor') generadoPor: string): Observable<any> {
    return this.httpService.get(`${this.companiasServiceUrl}/documentos/generado-por/${generadoPor}`)
      .pipe(map((response) => response.data));
  }

  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar documento', description: 'Modifica los datos de un documento existente' })
  @ApiParam({ name: 'id', description: 'UUID del documento', type: 'string' })
  @ApiBody({ type: UpdateDocumentoDto })
  @ApiResponse({ status: 200, description: 'Documento actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Documento no encontrado' })
  update(@Param('id') id: string, @Body() updateDocumentoDto: UpdateDocumentoDto): Observable<any> {
    return this.httpService.patch(`${this.companiasServiceUrl}/documentos/${id}`, updateDocumentoDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar documento', description: 'Elimina un documento del sistema' })
  @ApiParam({ name: 'id', description: 'UUID del documento', type: 'string' })
  @ApiResponse({ status: 200, description: 'Documento eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Documento no encontrado' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService.delete(`${this.companiasServiceUrl}/documentos/${id}`)
      .pipe(map((response) => response.data));
  }
}
