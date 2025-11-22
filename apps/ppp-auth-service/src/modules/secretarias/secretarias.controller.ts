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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { SecretariasService } from './secretarias.service';
import { CreateSecretariaDto } from './dto/create-secretaria.dto';
import { UpdateSecretariaDto } from './dto/update-secretaria.dto';

@ApiTags('Secretarias')
@Controller('secretarias')
export class SecretariasController {
  constructor(private readonly secretariasService: SecretariasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva secretaria' })
  @ApiBody({ type: CreateSecretariaDto })
  @ApiResponse({ status: 201, description: 'Secretaria creada exitosamente' })
  create(@Body() createDto: CreateSecretariaDto) {
    return this.secretariasService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las secretarias' })
  @ApiQuery({ name: 'escuela', required: false, description: 'Filtrar por ID de escuela' })
  @ApiResponse({ status: 200, description: 'Lista de secretarias' })
  findAll(@Query('escuela') escuela?: string) {
    if (escuela) {
      return this.secretariasService.findByEscuela(escuela);
    }
    return this.secretariasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una secretaria por ID' })
  @ApiResponse({ status: 200, description: 'Secretaria encontrada' })
  findOne(@Param('id') id: string) {
    return this.secretariasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una secretaria' })
  @ApiResponse({ status: 200, description: 'Secretaria actualizada' })
  update(@Param('id') id: string, @Body() updateDto: UpdateSecretariaDto) {
    return this.secretariasService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una secretaria' })
  @ApiResponse({ status: 204, description: 'Secretaria eliminada' })
  remove(@Param('id') id: string) {
    return this.secretariasService.remove(id);
  }
}
