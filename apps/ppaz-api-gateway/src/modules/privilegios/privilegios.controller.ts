import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrivilegiosService } from './privilegios.service';
import { CreatePrivilegioDto, UpdatePrivilegioDto } from './dto';

@ApiTags('privilegios')
@Controller('privilegios')
export class PrivilegiosController {
  constructor(private readonly privilegiosService: PrivilegiosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un privilegio' })
  create(@Body() createPrivilegioDto: CreatePrivilegioDto) {
    return this.privilegiosService.create(createPrivilegioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los privilegios' })
  findAll() {
    return this.privilegiosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un privilegio por ID' })
  findOne(@Param('id') id: string) {
    return this.privilegiosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un privilegio' })
  update(@Param('id') id: string, @Body() updatePrivilegioDto: UpdatePrivilegioDto) {
    return this.privilegiosService.update(id, updatePrivilegioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un privilegio' })
  remove(@Param('id') id: string) {
    return this.privilegiosService.remove(id);
  }
}
