import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { AlumnosService } from './alumnos.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

@ApiTags('Alumnos')
@Controller('alumnos')
export class AlumnosController {
  constructor(private readonly alumnosService: AlumnosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo alumno' })
  @ApiResponse({ status: 201, description: 'Alumno creado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'El usuario ya tiene perfil de alumno o código duplicado' })
  create(@Body() createAlumnoDto: CreateAlumnoDto) {
    return this.alumnosService.create(createAlumnoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los alumnos' })
  @ApiQuery({ name: 'escuela', required: false, description: 'Filtrar por ID de escuela' })
  @ApiResponse({ status: 200, description: 'Lista de alumnos' })
  findAll(@Query('escuela') escuela?: string) {
    if (escuela) {
      return this.alumnosService.findByEscuela(escuela);
    }
    return this.alumnosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un alumno por ID' })
  @ApiResponse({ status: 200, description: 'Alumno encontrado' })
  @ApiResponse({ status: 404, description: 'Alumno no encontrado' })
  findOne(@Param('id') id: string) {
    return this.alumnosService.findOne(id);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener alumno por usuario ID' })
  @ApiResponse({ status: 200, description: 'Alumno encontrado' })
  @ApiResponse({ status: 404, description: 'Alumno no encontrado' })
  findByUsuario(@Param('usuarioId') usuarioId: string) {
    return this.alumnosService.findByUsuarioId(usuarioId);
  }

  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un alumno' })
  @ApiResponse({ status: 200, description: 'Alumno actualizado' })
  @ApiResponse({ status: 404, description: 'Alumno no encontrado' })
  update(@Param('id') id: string, @Body() updateAlumnoDto: UpdateAlumnoDto) {
    return this.alumnosService.update(id, updateAlumnoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un alumno' })
  @ApiResponse({ status: 204, description: 'Alumno eliminado' })
  @ApiResponse({ status: 404, description: 'Alumno no encontrado' })
  remove(@Param('id') id: string) {
    return this.alumnosService.remove(id);
  }
}
