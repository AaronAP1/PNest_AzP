import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Put } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CreateCartaPresentacionDto } from './dto/create-carta-presentacion.dto';
import { UpdateCartaPresentacionDto } from './dto/update-carta-presentacion.dto';

@ApiTags('cartas')
@Controller('cartas')
export class CartasPresentacionController {
  constructor(
    @Inject('PPP_COMPANIAS_SERVICE') private readonly companiasClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear carta de presentación', description: 'Crea una nueva solicitud de carta de presentación' })
  @ApiBody({ type: CreateCartaPresentacionDto })
  @ApiResponse({ status: 201, description: 'Carta creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Alumno, empresa o secretaria no existe' })
  create(@Body() createCartaDto: CreateCartaPresentacionDto): Observable<any> {
    return this.companiasClient.send({ cmd: 'create_carta_presentacion' }, createCartaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las cartas', description: 'Obtiene todas las cartas de presentación registradas' })
  @ApiResponse({ status: 200, description: 'Lista de cartas obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.companiasClient.send({ cmd: 'find_all_cartas_presentacion' }, {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener carta por ID', description: 'Busca una carta específica por su UUID' })
  @ApiParam({ name: 'id', description: 'UUID de la carta', type: 'string' })
  @ApiResponse({ status: 200, description: 'Carta encontrada' })
  @ApiResponse({ status: 404, description: 'Carta no encontrada' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.companiasClient.send({ cmd: 'find_one_carta_presentacion' }, id);
  }

  @Get('alumno/:idAlumno')
  @ApiOperation({ summary: 'Listar cartas por alumno', description: 'Obtiene todas las cartas de un alumno específico' })
  @ApiParam({ name: 'idAlumno', description: 'UUID del alumno', type: 'string' })
  @ApiResponse({ status: 200, description: 'Lista de cartas del alumno' })
  findByAlumno(@Param('idAlumno') idAlumno: string): Observable<any> {
    return this.companiasClient.send({ cmd: 'find_cartas_by_alumno' }, idAlumno);
  }

  @Get('empresa/:idEmpresa')
  @ApiOperation({ summary: 'Listar cartas por empresa', description: 'Obtiene todas las cartas dirigidas a una empresa' })
  @ApiParam({ name: 'idEmpresa', description: 'UUID de la empresa', type: 'string' })
  @ApiResponse({ status: 200, description: 'Lista de cartas de la empresa' })
  findByEmpresa(@Param('idEmpresa') idEmpresa: string): Observable<any> {
    return this.companiasClient.send({ cmd: 'find_cartas_by_empresa' }, idEmpresa);
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Listar cartas por estado', description: 'Obtiene cartas filtradas por su estado actual' })
  @ApiParam({ name: 'estado', description: 'Estado de la carta', enum: ['draft', 'submitted', 'reviewing', 'approved', 'rejected', 'cancelled'] })
  @ApiResponse({ status: 200, description: 'Lista de cartas filtradas' })
  findByEstado(@Param('estado') estado: string): Observable<any> {
    return this.companiasClient.send({ cmd: 'find_cartas_by_estado' }, estado);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar carta', description: 'Actualiza los datos de una carta existente' })
  @ApiParam({ name: 'id', description: 'UUID de la carta', type: 'string' })
  @ApiBody({ type: UpdateCartaPresentacionDto })
  @ApiResponse({ status: 200, description: 'Carta actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Carta no encontrada' })
  update(@Param('id') id: string, @Body() updateCartaDto: UpdateCartaPresentacionDto): Observable<any> {
    return this.companiasClient.send({ cmd: 'update_carta_presentacion' }, { id, updateCartaPresentacionDto: updateCartaDto });
  }

  @Put(':id/enviar')
  @ApiOperation({ summary: 'Enviar carta', description: 'Cambia el estado de la carta a "enviada"' })
  @ApiParam({ name: 'id', description: 'UUID de la carta', type: 'string' })
  @ApiResponse({ status: 200, description: 'Carta enviada exitosamente' })
  @ApiResponse({ status: 400, description: 'La carta ya fue enviada o estado inválido' })
  submit(@Param('id') id: string): Observable<any> {
    return this.companiasClient.send({ cmd: 'submit_carta_presentacion' }, id);
  }

  @Put(':id/revisar')
  @ApiOperation({ summary: 'Marcar en revisión', description: 'Cambia el estado de la carta a "en revisión"' })
  @ApiParam({ name: 'id', description: 'UUID de la carta', type: 'string' })
  @ApiResponse({ status: 200, description: 'Carta marcada en revisión' })
  review(@Param('id') id: string): Observable<any> {
    return this.companiasClient.send({ cmd: 'review_carta_presentacion' }, id);
  }

  @Put(':id/aprobar')
  @ApiOperation({ summary: 'Aprobar carta', description: 'Aprueba una carta que está en revisión' })
  @ApiParam({ name: 'id', description: 'UUID de la carta', type: 'string' })
  @ApiResponse({ status: 200, description: 'Carta aprobada exitosamente' })
  approve(@Param('id') id: string): Observable<any> {
    return this.companiasClient.send({ cmd: 'approve_carta_presentacion' }, id);
  }

  @Put(':id/rechazar')
  @ApiOperation({ summary: 'Rechazar carta', description: 'Rechaza una carta con un motivo' })
  @ApiParam({ name: 'id', description: 'UUID de la carta', type: 'string' })
  @ApiBody({ schema: { properties: { motivoRechazo: { type: 'string', example: 'Falta documentación' } } } })
  @ApiResponse({ status: 200, description: 'Carta rechazada' })
  reject(@Param('id') id: string, @Body() body: { motivoRechazo: string }): Observable<any> {
    return this.companiasClient.send({ cmd: 'reject_carta_presentacion' }, { id, motivoRechazo: body.motivoRechazo });
  }

  @Put(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar carta', description: 'Cancela una carta de presentación' })
  @ApiParam({ name: 'id', description: 'UUID de la carta', type: 'string' })
  @ApiResponse({ status: 200, description: 'Carta cancelada' })
  @ApiResponse({ status: 400, description: 'No se puede cancelar una carta aprobada' })
  cancel(@Param('id') id: string): Observable<any> {
    return this.companiasClient.send({ cmd: 'cancel_carta_presentacion' }, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar carta', description: 'Elimina una carta (solo en estado draft o cancelled)' })
  @ApiParam({ name: 'id', description: 'UUID de la carta', type: 'string' })
  @ApiResponse({ status: 200, description: 'Carta eliminada exitosamente' })
  @ApiResponse({ status: 400, description: 'Solo se pueden eliminar cartas en draft o cancelled' })
  remove(@Param('id') id: string): Observable<any> {
    return this.companiasClient.send({ cmd: 'remove_carta_presentacion' }, id);
  }
}
