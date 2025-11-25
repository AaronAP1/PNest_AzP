import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AsignarUsuarioEntidadDto } from './dto/asignar-usuario-entidad.dto';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('PPP_AUTH_HOST');
    const port = this.configService.get<number>('PPP_AUTH_PORT');
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    
    // En Azure, usar HTTPS con el FQDN interno
    // En desarrollo, usar HTTP con host:port
    if (isProduction) {
      this.authServiceUrl = `https://${host}`;
    } else {
      this.authServiceUrl = `http://${host}:${port}`;
    }
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario', description: 'Registra un nuevo usuario en el sistema con roles asignados' })
  @ApiBody({ type: CreateUsuarioDto })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Body() createUsuarioDto: CreateUsuarioDto): Observable<any> {
    return this.httpService
      .post(`${this.authServiceUrl}/usuarios`, createUsuarioDto)
      .pipe(map((response) => response.data));
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios', description: 'Obtiene la lista completa de usuarios con sus roles' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente' })
  findAll(): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/usuarios`)
      .pipe(map((response) => response.data));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID', description: 'Busca un usuario específico por su UUID' })
  @ApiParam({ name: 'id', description: 'UUID del usuario', type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/usuarios/${id}`)
      .pipe(map((response) => response.data));
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Buscar usuario por email', description: 'Busca un usuario utilizando su dirección de correo electrónico' })
  @ApiParam({ name: 'email', description: 'Email del usuario', type: 'string', example: 'juan.perez@upeu.edu.pe' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findByEmail(@Param('email') email: string): Observable<any> {
    return this.httpService
      .get(`${this.authServiceUrl}/usuarios/email/${email}`)
      .pipe(map((response) => response.data));
  }

  @Put(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario', description: 'Actualiza los datos de un usuario existente' })
  @ApiParam({ name: 'id', description: 'UUID del usuario', type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiBody({ type: UpdateUsuarioDto })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Observable<any> {
    return this.httpService
      .patch(`${this.authServiceUrl}/usuarios/${id}`, updateUsuarioDto)
      .pipe(map((response) => response.data));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario', description: 'Elimina un usuario del sistema' })
  @ApiParam({ name: 'id', description: 'UUID del usuario', type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id') id: string): Observable<any> {
    return this.httpService
      .delete(`${this.authServiceUrl}/usuarios/${id}`)
      .pipe(map((response) => response.data));
  }

  @Post('asignar-entidad')
  @ApiOperation({ 
    summary: 'Asignar un usuario a una entidad (alumno, secretaria, supervisor o coordinador)',
    description: 'Permite asignar un usuario existente a uno de los tipos de entidad del sistema'
  })
  @ApiBody({ 
    type: AsignarUsuarioEntidadDto,
    examples: {
      alumno: {
        summary: 'Asignar a Alumno',
        value: {
          usuarioId: '123e4567-e89b-12d3-a456-426614174000',
          tipoEntidad: 'alumno',
          idEscuela: '123e4567-e89b-12d3-a456-426614174001',
          codigo: '2020123456',
          ciclo: 'IX',
          año: '2020'
        }
      },
      secretaria: {
        summary: 'Asignar a Secretaria',
        value: {
          usuarioId: '123e4567-e89b-12d3-a456-426614174000',
          tipoEntidad: 'secretaria',
          idEscuela: '123e4567-e89b-12d3-a456-426614174001'
        }
      },
      supervisor: {
        summary: 'Asignar a Supervisor',
        value: {
          usuarioId: '123e4567-e89b-12d3-a456-426614174000',
          tipoEntidad: 'supervisor',
          idEscuela: '123e4567-e89b-12d3-a456-426614174001'
        }
      },
      coordinador: {
        summary: 'Asignar a Coordinador',
        value: {
          usuarioId: '123e4567-e89b-12d3-a456-426614174000',
          tipoEntidad: 'coordinador',
          idEscuela: '123e4567-e89b-12d3-a456-426614174001'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario asignado exitosamente a la entidad',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        usuarioId: { type: 'string', format: 'uuid' },
        idEscuela: { type: 'string', format: 'uuid' },
        codigo: { type: 'string', nullable: true },
        ciclo: { type: 'string', nullable: true },
        año: { type: 'string', nullable: true }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o usuario ya asignado a esta entidad' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  asignarUsuarioEntidad(@Body() asignarDto: AsignarUsuarioEntidadDto): Observable<any> {
    return this.httpService
      .post(`${this.authServiceUrl}/usuarios/asignar-entidad`, asignarDto)
      .pipe(map((response) => response.data));
  }
}
