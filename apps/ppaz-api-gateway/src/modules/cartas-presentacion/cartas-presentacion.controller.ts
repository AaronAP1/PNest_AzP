import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateCartaPresentacionDto } from './dto/create-carta-presentacion.dto';
import { UpdateCartaPresentacionDto } from './dto/update-carta-presentacion.dto';

@ApiTags('cartas')
@Controller('cartas')
export class CartasPresentacionController {
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
  @ApiOperation({ summary: 'Crear carta de presentación', description: 'Crea una nueva solicitud de carta de presentación' })
  @ApiBody({ type: CreateCartaPresentacionDto })
  @ApiResponse({ status: 201, description: 'Carta creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Alumno, empresa o secretaria no existe' })
  create(@Body() createCartaDto: CreateCartaPresentacionDto): Observable<any> {
    return this.httpService.post(`${this.companiasServiceUrl}/cartas-presentacion`, createCartaDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las cartas', description: 'Obtiene todas las cartas de presentación registradas' })
  @ApiResponse({ status: 200, description: 'Lista de cartas obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService.get(`${this.companiasServiceUrl}/cartas-presentacion`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener carta por ID', description: 'Busca una carta específica por su UUID' })
  @ApiParam({ name: 'id', description: 'UUID de la carta', type: 'string' })
  @ApiResponse({ status: 200, description: 'Carta encontrada' })
  @ApiResponse({ status: 404, description: 'Carta no encontrada' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService.get(`${this.companiasServiceUrl}/cartas-presentacion/${id}`)
      .pipe(map((response) => response.data));
  }

  @Get('alumno/:idAlumno')
  @ApiOperation({ summary: 'Listar cartas por alumno', description: 'Obtiene todas las cartas de un alumno específico' })
  @ApiParam({ name: 'idAlumno', description: 'UUID del alumno', type: 'string' })
  @ApiResponse({ status: 200, description: 'Lista de cartas del alumno' })
  findByAlumno(@Param('idAlumno') idAlumno: string): Observable<any> {
    return this.httpService.get(`${this.companiasServiceUrl}/cartas-presentacion/alumno/${idAlumno}`)
      .pipe(map((response) => response.data));
  }

  @Get('empresa/:idEmpresa')
  @ApiOperation({ summary: 'Listar cartas por empresa', description: 'Obtiene todas las cartas dirigidas a una empresa' })
  @ApiParam({ name: 'idEmpresa', description: 'UUID de la empresa', type: 'string' })
  @ApiResponse({ status: 200, description: 'Lista de cartas de la empresa' })
  findByEmpresa(@Param('idEmpresa') idEmpresa: string): Observable<any> {
    return this.httpService.get(`${this.companiasServiceUrl}/cartas-presentacion/empresa/${idEmpresa}`)
      .pipe(map((response) => response.data));
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Listar cartas por estado', description: 'Obtiene cartas filtradas por su estado actual' })
  @ApiParam({ name: 'estado', description: 'Estado de la carta', enum: ['draft', 'submitted', 'reviewing', 'approved', 'rejected', 'cancelled'] })
  @ApiResponse({ status: 200, description: 'Lista de cartas filtradas' })
  findByEstado(@Param('estado') estado: string): Observable<any> {
    return this.httpService.get(`${this.companiasServiceUrl}/cartas-presentacion/estado/${estado}`)
      .pipe(map((response) => response.data));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar carta', description: 'Actualiza los datos de una carta existente' })
  @ApiParam({ name: 'id', description: 'UUID de la carta', type: 'string' })
  @ApiBody({ type: UpdateCartaPresentacionDto })
  @ApiResponse({ status: 200, description: 'Carta actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Carta no encontrada' })
  update(@Param('id') id: string, @Body() updateCartaDto: UpdateCartaPresentacionDto): Observable<any> {
    return this.httpService.patch(`${this.companiasServiceUrl}/cartas-presentacion/${id}`, updateCartaDto)
      .pipe(map((response) => response.data));
  }

  @Put(':id/enviar')
  @ApiOperation({ summary: 'Enviar carta', description: 'Cambia el estado de la carta a "enviada"' })
  @ApiParam({ name: 'id', description: 'UUID de la carta', type: 'string' })
  @ApiResponse({ status: 200, description: 'Carta enviada exitosamente' })
  @ApiResponse({ status: 400, description: 'La carta ya fue enviada o estado inválido' })
  submit(@Param('id') id: string): Observable<any> {
    return this.httpService.post(`${this.companiasServiceUrl}/cartas-presentacion/${id}/submit`, {})
      .pipe(map((response) => response.data));
  }

  @Put(':id/revisar')
  @ApiOperation({ summary: 'Marcar en revisión', description: 'Cambia el estado de la carta a "en revisión"' })
  @ApiParam({ name: 'id', description: 'UUID de la carta', type: 'string' })
  @ApiResponse({ status: 200, description: 'Carta marcada en revisión' })
  review(@Param('id') id: string): Observable<any> {
    return this.httpService.post(`${this.companiasServiceUrl}/cartas-presentacion/${id}/review`, {})
      .pipe(map((response) => response.data));
  }

  @Put(':id/aprobar')
  @ApiOperation({ summary: 'Aprobar carta', description: 'Aprueba una carta que está en revisión' })
  @ApiParam({ name: 'id', description: 'UUID de la carta', type: 'string' })
  @ApiResponse({ status: 200, description: 'Carta aprobada exitosamente' })
  approve(@Param('id') id: string): Observable<any> {
    return this.httpService.post(`${this.companiasServiceUrl}/cartas-presentacion/${id}/approve`, {})
      .pipe(map((response) => response.data));
  }

  @Put(':id/rechazar')
  @ApiOperation({ summary: 'Rechazar carta', description: 'Rechaza una carta con un motivo' })
  @ApiParam({ name: 'id', description: 'UUID de la carta', type: 'string' })
  @ApiBody({ schema: { properties: { motivoRechazo: { type: 'string', example: 'Falta documentación' } } } })
  @ApiResponse({ status: 200, description: 'Carta rechazada' })
  reject(@Param('id') id: string, @Body() body: { motivoRechazo: string }): Observable<any> {
    return this.httpService.post(`${this.companiasServiceUrl}/cartas-presentacion/${id}/reject`, body)
      .pipe(map((response) => response.data));
  }

  @Put(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar carta', description: 'Cancela una carta de presentación' })
  @ApiParam({ name: 'id', description: 'UUID de la carta', type: 'string' })
  @ApiResponse({ status: 200, description: 'Carta cancelada' })
  @ApiResponse({ status: 400, description: 'No se puede cancelar una carta aprobada' })
  cancel(@Param('id') id: string): Observable<any> {
    return this.httpService.post(`${this.companiasServiceUrl}/cartas-presentacion/${id}/cancel`, {})
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar carta', description: 'Elimina una carta (solo en estado draft o cancelled)' })
  @ApiParam({ name: 'id', description: 'UUID de la carta', type: 'string' })
  @ApiResponse({ status: 200, description: 'Carta eliminada exitosamente' })
  @ApiResponse({ status: 400, description: 'Solo se pueden eliminar cartas en draft o cancelled' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService.delete(`${this.companiasServiceUrl}/cartas-presentacion/${id}`)
      .pipe(map((response) => response.data));
  }
}
