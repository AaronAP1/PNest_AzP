import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartasPresentacionService } from './cartas-presentacion.service';
import { CreateCartaPresentacionDto, UpdateCartaPresentacionDto } from './dto';
import { CartaEstado } from '../../../../../node_modules/.prisma/client-companias';

@Controller('cartas-presentacion')
export class CartasPresentacionController {
  constructor(
    private readonly cartasPresentacionService: CartasPresentacionService,
  ) {}

  // HTTP REST Endpoints (Azure Container Apps) - Standard CRUD
  @Post()
  createHttp(@Body() createCartaPresentacionDto: CreateCartaPresentacionDto) {
    return this.cartasPresentacionService.create(createCartaPresentacionDto);
  }

  @Get()
  findAllHttp() {
    return this.cartasPresentacionService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.cartasPresentacionService.findOne(id);
  }

  @Get('alumno/:idAlumno')
  findByAlumnoHttp(@Param('idAlumno') idAlumno: string) {
    return this.cartasPresentacionService.findByUsuario(idAlumno);
  }

  @Get('empresa/:idEmpresa')
  findByEmpresaHttp(@Param('idEmpresa') idEmpresa: string) {
    return this.cartasPresentacionService.findByEmpresa(idEmpresa);
  }

  @Get('estado/:estado')
  findByEstadoHttp(@Param('estado') estado: CartaEstado) {
    return this.cartasPresentacionService.findByEstado(estado);
  }

  @Patch(':id')
  updateHttp(
    @Param('id') id: string,
    @Body() updateCartaPresentacionDto: UpdateCartaPresentacionDto,
  ) {
    return this.cartasPresentacionService.update(id, updateCartaPresentacionDto);
  }

  @Delete(':id')
  removeHttp(@Param('id') id: string) {
    return this.cartasPresentacionService.remove(id);
  }

  // HTTP REST Endpoints - Workflow State Operations
  @Post(':id/submit')
  submitHttp(@Param('id') id: string) {
    return this.cartasPresentacionService.submit(id);
  }

  @Post(':id/review')
  reviewHttp(@Param('id') id: string) {
    return this.cartasPresentacionService.review(id);
  }

  @Post(':id/approve')
  approveHttp(@Param('id') id: string) {
    return this.cartasPresentacionService.approve(id);
  }

  @Post(':id/reject')
  rejectHttp(@Param('id') id: string, @Body() body: { motivoRechazo: string }) {
    return this.cartasPresentacionService.reject(id, body.motivoRechazo);
  }

  @Post(':id/cancel')
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
