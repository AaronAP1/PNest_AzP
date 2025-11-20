import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartasPresentacionService } from './cartas-presentacion.service';
import { CreateCartaPresentacionDto, UpdateCartaPresentacionDto } from './dto';
import { CartaEstado } from '../../../../../node_modules/.prisma/client-core';

@ApiTags('Cartas de Presentación')
@Controller('cartas-presentacion')
export class CartasPresentacionController {
  constructor(
    private readonly cartasPresentacionService: CartasPresentacionService,
  ) {}

  // HTTP REST Endpoints (Azure Container Apps) - Standard CRUD
  @Post()
  @ApiOperation({ summary: 'Crear una nueva carta de presentación' })
  @ApiResponse({ status: 201, description: 'Carta creada exitosamente' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  createHttp(@Body() createCartaPresentacionDto: CreateCartaPresentacionDto) {
    return this.cartasPresentacionService.create(createCartaPresentacionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las cartas de presentación' })
  @ApiResponse({ status: 200, description: 'Lista de cartas con empresa y solicitud' })
  findAllHttp() {
    return this.cartasPresentacionService.findAll();
  }

  @Get('alumno/:idAlumno')
  @ApiOperation({ summary: 'Obtener cartas por alumno' })
  @ApiParam({ name: 'idAlumno', description: 'UUID del alumno (referencia a ppp_auth.alumnos)' })
  @ApiResponse({ status: 200, description: 'Lista de cartas del alumno' })
  findByAlumnoHttp(@Param('idAlumno') idAlumno: string) {
    return this.cartasPresentacionService.findByUsuario(idAlumno);
  }

  @Get('empresa/:idEmpresa')
  @ApiOperation({ summary: 'Obtener cartas por empresa' })
  @ApiParam({ name: 'idEmpresa', description: 'UUID de la empresa' })
  @ApiResponse({ status: 200, description: 'Lista de cartas de la empresa' })
  findByEmpresaHttp(@Param('idEmpresa') idEmpresa: string) {
    return this.cartasPresentacionService.findByEmpresa(idEmpresa);
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Obtener cartas por estado' })
  @ApiParam({ name: 'estado', description: 'Estado (borrador, presentada, en_revision, aprobada, rechazada, cancelada)' })
  @ApiResponse({ status: 200, description: 'Lista de cartas con el estado especificado' })
  findByEstadoHttp(@Param('estado') estado: CartaEstado) {
    return this.cartasPresentacionService.findByEstado(estado);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una carta por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la carta' })
  @ApiResponse({ status: 200, description: 'Carta encontrada' })
  @ApiResponse({ status: 404, description: 'Carta no encontrada' })
  findOneHttp(@Param('id') id: string) {
    return this.cartasPresentacionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una carta' })
  @ApiParam({ name: 'id', description: 'UUID de la carta' })
  @ApiResponse({ status: 200, description: 'Carta actualizada' })
  @ApiResponse({ status: 404, description: 'Carta no encontrada' })
  updateHttp(
    @Param('id') id: string,
    @Body() updateCartaPresentacionDto: UpdateCartaPresentacionDto,
  ) {
    return this.cartasPresentacionService.update(id, updateCartaPresentacionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una carta' })
  @ApiParam({ name: 'id', description: 'UUID de la carta' })
  @ApiResponse({ status: 204, description: 'Carta eliminada' })
  @ApiResponse({ status: 404, description: 'Carta no encontrada' })
  removeHttp(@Param('id') id: string) {
    return this.cartasPresentacionService.remove(id);
  }

  // HTTP REST Endpoints - Workflow State Operations
  @Post(':id/submit')
  @ApiOperation({ summary: 'Presentar carta (borrador → presentada)' })
  @ApiParam({ name: 'id', description: 'UUID de la carta' })
  @ApiResponse({ status: 200, description: 'Carta presentada exitosamente' })
  @ApiResponse({ status: 400, description: 'Estado inválido para esta operación' })
  submitHttp(@Param('id') id: string) {
    return this.cartasPresentacionService.submit(id);
  }

  @Post(':id/review')
  @ApiOperation({ summary: 'Poner carta en revisión (presentada → en_revision)' })
  @ApiParam({ name: 'id', description: 'UUID de la carta' })
  @ApiResponse({ status: 200, description: 'Carta en revisión' })
  @ApiResponse({ status: 400, description: 'Estado inválido para esta operación' })
  reviewHttp(@Param('id') id: string) {
    return this.cartasPresentacionService.review(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Aprobar carta (en_revision → aprobada)' })
  @ApiParam({ name: 'id', description: 'UUID de la carta' })
  @ApiResponse({ status: 200, description: 'Carta aprobada' })
  @ApiResponse({ status: 400, description: 'Estado inválido para esta operación' })
  approveHttp(@Param('id') id: string) {
    return this.cartasPresentacionService.approve(id);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Rechazar carta (en_revision → rechazada)' })
  @ApiParam({ name: 'id', description: 'UUID de la carta' })
  @ApiBody({ schema: { properties: { motivoRechazo: { type: 'string', description: 'Razón del rechazo' } } } })
  @ApiResponse({ status: 200, description: 'Carta rechazada' })
  @ApiResponse({ status: 400, description: 'Estado inválido o motivo de rechazo faltante' })
  rejectHttp(@Param('id') id: string, @Body() body: { motivoRechazo: string }) {
    return this.cartasPresentacionService.reject(id, body.motivoRechazo);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancelar carta (cualquier estado → cancelada)' })
  @ApiParam({ name: 'id', description: 'UUID de la carta' })
  @ApiResponse({ status: 200, description: 'Carta cancelada' })
  cancelHttp(@Param('id') id: string) {
    return this.cartasPresentacionService.cancel(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create_carta_presentacion' })
  create(@Payload() createCartaPresentacionDto: CreateCartaPresentacionDto) {
    return this.cartasPresentacionService.create(createCartaPresentacionDto);
  }

  @MessagePattern({ cmd: 'find_all_cartas_presentacion' })
  findAll() {
    return this.cartasPresentacionService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_carta_presentacion' })
  findOne(@Payload() id: string) {
    return this.cartasPresentacionService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_cartas_by_alumno' })
  findByUsuario(@Payload() idAlumno: string) {
    return this.cartasPresentacionService.findByUsuario(idAlumno);
  }

  @MessagePattern({ cmd: 'find_cartas_by_empresa' })
  findByEmpresa(@Payload() idEmpresa: string) {
    return this.cartasPresentacionService.findByEmpresa(idEmpresa);
  }

  @MessagePattern({ cmd: 'find_cartas_by_estado' })
  findByEstado(@Payload() estado: CartaEstado) {
    return this.cartasPresentacionService.findByEstado(estado);
  }

  @MessagePattern({ cmd: 'update_carta_presentacion' })
  update(@Payload() payload: { id: string; updateCartaPresentacionDto: UpdateCartaPresentacionDto }) {
    return this.cartasPresentacionService.update(
      payload.id,
      payload.updateCartaPresentacionDto,
    );
  }

  @MessagePattern({ cmd: 'submit_carta_presentacion' })
  submit(@Payload() id: string) {
    return this.cartasPresentacionService.submit(id);
  }

  @MessagePattern({ cmd: 'review_carta_presentacion' })
  review(@Payload() id: string) {
    return this.cartasPresentacionService.review(id);
  }

  @MessagePattern({ cmd: 'approve_carta_presentacion' })
  approve(@Payload() id: string) {
    return this.cartasPresentacionService.approve(id);
  }

  @MessagePattern({ cmd: 'reject_carta_presentacion' })
  reject(@Payload() payload: { id: string; motivoRechazo: string }) {
    return this.cartasPresentacionService.reject(payload.id, payload.motivoRechazo);
  }

  @MessagePattern({ cmd: 'cancel_carta_presentacion' })
  cancel(@Payload() id: string) {
    return this.cartasPresentacionService.cancel(id);
  }

  @MessagePattern({ cmd: 'remove_carta_presentacion' })
  remove(@Payload() id: string) {
    return this.cartasPresentacionService.remove(id);
  }
}
