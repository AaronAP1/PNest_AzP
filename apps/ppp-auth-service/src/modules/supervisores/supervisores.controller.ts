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
import { SupervisoresService } from './supervisores.service';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { UpdateSupervisorDto } from './dto/update-supervisor.dto';

@ApiTags('Supervisores')
@Controller('supervisores')
export class SupervisoresController {
  constructor(private readonly supervisoresService: SupervisoresService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo supervisor' })
  @ApiBody({ type: CreateSupervisorDto })
  @ApiResponse({ status: 201, description: 'Supervisor creado exitosamente' })
  create(@Body() createDto: CreateSupervisorDto) {
    return this.supervisoresService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los supervisores' })
  @ApiQuery({ name: 'escuela', required: false, description: 'Filtrar por ID de escuela' })
  @ApiResponse({ status: 200, description: 'Lista de supervisores' })
  findAll(@Query('escuela') escuela?: string) {
    if (escuela) {
      return this.supervisoresService.findByEscuela(escuela);
    }
    return this.supervisoresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un supervisor por ID' })
  @ApiResponse({ status: 200, description: 'Supervisor encontrado' })
  findOne(@Param('id') id: string) {
    return this.supervisoresService.findOne(id);
  }

  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un supervisor' })
  @ApiResponse({ status: 200, description: 'Supervisor actualizado' })
  update(@Param('id') id: string, @Body() updateDto: UpdateSupervisorDto) {
    return this.supervisoresService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un supervisor' })
  @ApiResponse({ status: 204, description: 'Supervisor eliminado' })
  remove(@Param('id') id: string) {
    return this.supervisoresService.remove(id);
  }
}
