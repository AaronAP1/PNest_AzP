import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AlumnosService } from './alumnos.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

@Controller('alumnos')
export class AlumnosController {
  constructor(private readonly alumnosService: AlumnosService) {}

  // HTTP REST Endpoints (Azure Container Apps)
  @Post()
  createHttp(@Body() createAlumnoDto: CreateAlumnoDto) {
    return this.alumnosService.create(createAlumnoDto);
  }

  @Get()
  findAllHttp() {
    return this.alumnosService.findAll();
  }

  @Get(':id')
  findOneHttp(@Param('id') id: string) {
    return this.alumnosService.findOne(id);
  }

  @Get('usuario/:usuarioId')
  findByUsuarioHttp(@Param('usuarioId') usuarioId: string) {
    return this.alumnosService.findByUsuarioId(usuarioId);
  }

  @Get('codigo/:codigo')
  findByCodigoHttp(@Param('codigo') codigo: string) {
    return this.alumnosService.findByCodigo(codigo);
  }

  @Get('escuela/:idEscuela')
  findByEscuelaHttp(@Param('idEscuela') idEscuela: string) {
    return this.alumnosService.findByEscuela(idEscuela);
  }

  @Patch(':id')
  updateHttp(@Param('id') id: string, @Body() updateAlumnoDto: UpdateAlumnoDto) {
    return this.alumnosService.update(id, updateAlumnoDto);
  }

  @Delete(':id')
  removeHttp(@Param('id') id: string) {
    return this.alumnosService.remove(id);
  }

  // Microservice Patterns (Local Development)
  @MessagePattern({ cmd: 'create_alumno' })
  create(@Payload() createAlumnoDto: CreateAlumnoDto) {
    return this.alumnosService.create(createAlumnoDto);
  }

  @MessagePattern({ cmd: 'find_all_alumnos' })
  findAll() {
    return this.alumnosService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_alumno' })
  findOne(@Payload() id: string) {
    return this.alumnosService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_alumno_by_usuario' })
  findByUsuario(@Payload() usuarioId: string) {
    return this.alumnosService.findByUsuarioId(usuarioId);
  }

  @MessagePattern({ cmd: 'find_alumno_by_codigo' })
  findByCodigo(@Payload() codigo: string) {
    return this.alumnosService.findByCodigo(codigo);
  }

  @MessagePattern({ cmd: 'find_alumnos_by_escuela' })
  findByEscuela(@Payload() idEscuela: string) {
    return this.alumnosService.findByEscuela(idEscuela);
  }

  @MessagePattern({ cmd: 'update_alumno' })
  update(@Payload() payload: { id: string; data: UpdateAlumnoDto }) {
    return this.alumnosService.update(payload.id, payload.data);
  }

  @MessagePattern({ cmd: 'remove_alumno' })
  remove(@Payload() id: string) {
    return this.alumnosService.remove(id);
  }
}
