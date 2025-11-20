import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CoordinadoresService } from './coordinadores.service';
import { CreateCoordinadorDto } from './dto/create-coordinador.dto';
import { UpdateCoordinadorDto } from './dto/update-coordinador.dto';

@ApiTags('Coordinadores')
@Controller('coordinadores')
export class CoordinadoresController {
  constructor(private readonly coordinadoresService: CoordinadoresService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo coordinador' })
  @ApiResponse({ status: 201, description: 'Coordinador creado exitosamente' })
  create(@Body() createDto: CreateCoordinadorDto) {
    return this.coordinadoresService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los coordinadores' })
  @ApiQuery({ name: 'escuela', required: false, description: 'Filtrar por ID de escuela' })
  @ApiResponse({ status: 200, description: 'Lista de coordinadores' })
  findAll(@Query('escuela') escuela?: string) {
    if (escuela) {
      return this.coordinadoresService.findByEscuela(escuela);
    }
    return this.coordinadoresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un coordinador por ID' })
  @ApiResponse({ status: 200, description: 'Coordinador encontrado' })
  findOne(@Param('id') id: string) {
    return this.coordinadoresService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un coordinador' })
  @ApiResponse({ status: 200, description: 'Coordinador actualizado' })
  update(@Param('id') id: string, @Body() updateDto: UpdateCoordinadorDto) {
    return this.coordinadoresService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un coordinador' })
  @ApiResponse({ status: 204, description: 'Coordinador eliminado' })
  remove(@Param('id') id: string) {
    return this.coordinadoresService.remove(id);
  }
}
