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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PrivilegiosService } from './privilegios.service';
import { CreatePrivilegioDto } from './dto/create-privilegio.dto';
import { UpdatePrivilegioDto } from './dto/update-privilegio.dto';

@ApiTags('Privilegios')
@Controller('privilegios')
export class PrivilegiosController {
  constructor(private readonly privilegiosService: PrivilegiosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo privilegio' })
  @ApiBody({ type: CreatePrivilegioDto })
  @ApiResponse({ status: 201, description: 'Privilegio creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El privilegio ya existe' })
  create(@Body() createPrivilegioDto: CreatePrivilegioDto) {
    return this.privilegiosService.create(createPrivilegioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los privilegios' })
  @ApiResponse({ status: 200, description: 'Lista de privilegios' })
  findAll() {
    return this.privilegiosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un privilegio por ID' })
  @ApiResponse({ status: 200, description: 'Privilegio encontrado' })
  @ApiResponse({ status: 404, description: 'Privilegio no encontrado' })
  findOne(@Param('id') id: string) {
    return this.privilegiosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un privilegio' })
  @ApiResponse({ status: 200, description: 'Privilegio actualizado' })
  @ApiResponse({ status: 404, description: 'Privilegio no encontrado' })
  update(@Param('id') id: string, @Body() updatePrivilegioDto: UpdatePrivilegioDto) {
    return this.privilegiosService.update(id, updatePrivilegioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un privilegio' })
  @ApiResponse({ status: 204, description: 'Privilegio eliminado' })
  @ApiResponse({ status: 404, description: 'Privilegio no encontrado' })
  remove(@Param('id') id: string) {
    return this.privilegiosService.remove(id);
  }
}
