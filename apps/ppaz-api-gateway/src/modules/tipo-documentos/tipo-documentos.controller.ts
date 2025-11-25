import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateTipoDocumentoDto } from './dto/create-tipo-documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo-documento.dto';

@ApiTags('tipo-documentos')
@Controller('tipo-documentos')
export class TipoDocumentosController {
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
  @ApiOperation({ summary: 'Crear tipo de documento', description: 'Registra un nuevo tipo de documento' })
  @ApiBody({ type: CreateTipoDocumentoDto })
  @ApiResponse({ status: 201, description: 'Tipo de documento creado exitosamente' })
  create(@Body() createTipoDocumentoDto: CreateTipoDocumentoDto): Observable<any> {
    return this.httpService.post(`${this.companiasServiceUrl}/tipo-documentos`, createTipoDocumentoDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar tipos de documentos', description: 'Obtiene todos los tipos de documentos registrados' })
  @ApiResponse({ status: 200, description: 'Lista obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService.get(`${this.companiasServiceUrl}/tipo-documentos`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tipo de documento por ID', description: 'Busca un tipo de documento por su UUID' })
  @ApiParam({ name: 'id', description: 'UUID del tipo de documento', type: 'string' })
  @ApiResponse({ status: 200, description: 'Tipo de documento encontrado' })
  @ApiResponse({ status: 404, description: 'Tipo de documento no encontrado' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService.get(`${this.companiasServiceUrl}/tipo-documentos/${id}`)
      .pipe(map((response) => response.data));
  }

  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tipo de documento', description: 'Modifica los datos de un tipo de documento existente' })
  @ApiParam({ name: 'id', description: 'UUID del tipo de documento', type: 'string' })
  @ApiBody({ type: UpdateTipoDocumentoDto })
  @ApiResponse({ status: 200, description: 'Tipo de documento actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Tipo de documento no encontrado' })
  update(@Param('id') id: string, @Body() updateTipoDocumentoDto: UpdateTipoDocumentoDto): Observable<any> {
    return this.httpService.patch(`${this.companiasServiceUrl}/tipo-documentos/${id}`, updateTipoDocumentoDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar tipo de documento', description: 'Elimina un tipo de documento del sistema' })
  @ApiParam({ name: 'id', description: 'UUID del tipo de documento', type: 'string' })
  @ApiResponse({ status: 200, description: 'Tipo de documento eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Tipo de documento no encontrado' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService.delete(`${this.companiasServiceUrl}/tipo-documentos/${id}`)
      .pipe(map((response) => response.data));
  }
}
