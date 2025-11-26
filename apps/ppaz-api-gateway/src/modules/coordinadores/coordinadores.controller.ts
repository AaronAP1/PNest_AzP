import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateCoordinadorDto } from './dto/create-coordinador.dto';

@ApiTags('coordinadores')
@Controller('coordinadores')
export class CoordinadoresController {
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
  @ApiOperation({ summary: 'Crear un nuevo coordinador' })
  @ApiBody({ type: CreateCoordinadorDto })
  @ApiResponse({ status: 201, description: 'Coordinador creado exitosamente' })
  create(@Body() createDto: CreateCoordinadorDto): Observable<any> {
    return this.httpService
      .post(`${this.authServiceUrl}/coordinadores`, createDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los coordinadores' })
  @ApiResponse({ status: 200, description: 'Lista de coordinadores obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/coordinadores`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener coordinador por ID' })
  @ApiParam({ name: 'id', description: 'UUID del coordinador' })
  @ApiResponse({ status: 200, description: 'Coordinador encontrado' })
  @ApiResponse({ status: 404, description: 'Coordinador no encontrado' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/coordinadores/${id}`)
      .pipe(map((response) => response.data));
  }

  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar coordinador' })
  @ApiParam({ name: 'id', description: 'UUID del coordinador' })
  update(@Param('id') id: string, @Body() updateDto: any): Observable<any> {
    return this.httpService
      .patch(`${this.authServiceUrl}/coordinadores/${id}`, updateDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar coordinador' })
  @ApiParam({ name: 'id', description: 'UUID del coordinador' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService
      .delete(`${this.authServiceUrl}/coordinadores/${id}`)
      .pipe(map((response) => response.data));
  }
}
