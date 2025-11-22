import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreatePrivilegioDto } from './dto/create-privilegio.dto';
import { UpdatePrivilegioDto } from './dto/update-privilegio.dto';

@ApiTags('privilegios')
@Controller('privilegios')
export class PrivilegiosController {
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('PPP_AUTH_HOST');
    const port = this.configService.get<number>('PPP_AUTH_PORT');
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    
    this.authServiceUrl = isProduction 
      ? `https://${host}` 
      : `http://${host}:${port}`;
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo privilegio' })
  @ApiBody({ type: CreatePrivilegioDto })
  @ApiResponse({ status: 201, description: 'Privilegio creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El privilegio ya existe' })
  create(@Body() createPrivilegioDto: CreatePrivilegioDto): Observable<any> {
    return this.httpService
      .post(`${this.authServiceUrl}/privilegios`, createPrivilegioDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los privilegios' })
  @ApiResponse({ status: 200, description: 'Lista de privilegios' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/privilegios`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un privilegio por ID' })
  @ApiParam({ name: 'id', description: 'UUID del privilegio', type: 'string' })
  @ApiResponse({ status: 200, description: 'Privilegio encontrado' })
  @ApiResponse({ status: 404, description: 'Privilegio no encontrado' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/privilegios/${id}`)
      .pipe(map((response) => response.data));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un privilegio' })
  @ApiParam({ name: 'id', description: 'UUID del privilegio', type: 'string' })
  @ApiBody({ type: UpdatePrivilegioDto })
  @ApiResponse({ status: 200, description: 'Privilegio actualizado' })
  @ApiResponse({ status: 404, description: 'Privilegio no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updatePrivilegioDto: UpdatePrivilegioDto,
  ): Observable<any> {
    return this.httpService
      .patch(`${this.authServiceUrl}/privilegios/${id}`, updatePrivilegioDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un privilegio' })
  @ApiParam({ name: 'id', description: 'UUID del privilegio', type: 'string' })
  @ApiResponse({ status: 204, description: 'Privilegio eliminado' })
  @ApiResponse({ status: 404, description: 'Privilegio no encontrado' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService
      .delete(`${this.authServiceUrl}/privilegios/${id}`)
      .pipe(map((response) => response.data));
  }
}
