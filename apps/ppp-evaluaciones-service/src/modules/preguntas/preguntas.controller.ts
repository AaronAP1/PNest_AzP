import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PreguntasService } from './preguntas.service';
import { CreatePreguntaDto } from './dto/create-pregunta.dto';
import { UpdatePreguntaDto } from './dto/update-pregunta.dto';

@ApiTags('Preguntas')
@Controller('preguntas')
export class PreguntasController {
  constructor(private readonly preguntasService: PreguntasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva pregunta' })
  @ApiBody({ type: CreatePreguntaDto })
  @ApiResponse({ status: 201, description: 'Pregunta creada exitosamente' })
  @MessagePattern({ cmd: 'create-pregunta' })
  create(@Body() @Payload() createDto: CreatePreguntaDto) {
    return this.preguntasService.create(createDto);
  }

  @Get()
  @MessagePattern({ cmd: 'find-all-preguntas' })
  findAll() {
    return this.preguntasService.findAll();
  }

  @Get('activas')
  @MessagePattern({ cmd: 'find-preguntas-activas' })
  findAllActivas() {
    return this.preguntasService.findAllActivas();
  }

  @Get(':id')
  @MessagePattern({ cmd: 'find-one-pregunta' })
  findOne(@Param('id') @Payload() id: string) {
    return this.preguntasService.findOne(id);
  }

  @Put(':id')
  @Patch(':id')
  @MessagePattern({ cmd: 'update-pregunta' })
  update(@Param('id') id: string, @Body() @Payload() updateDto: UpdatePreguntaDto) {
    return this.preguntasService.update(id, updateDto);
  }

  @Delete(':id')
  @MessagePattern({ cmd: 'remove-pregunta' })
  remove(@Param('id') @Payload() id: string) {
    return this.preguntasService.remove(id);
  }
}
