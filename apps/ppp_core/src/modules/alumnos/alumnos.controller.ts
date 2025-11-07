import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AlumnosService } from './alumnos.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

@Controller()
export class AlumnosController {
  constructor(private readonly alumnosService: AlumnosService) {}

  @MessagePattern({ cmd: 'create_alumno' })
  create(@Payload() createAlumnoDto: CreateAlumnoDto) {
    return this.alumnosService.create(createAlumnoDto);
  }

  @MessagePattern({ cmd: 'find_all_alumnos' })
  findAll() {
    return this.alumnosService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_alumno' })
  findOne(@Payload() id: string) {
    return this.alumnosService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_alumno_by_usuario' })
  findByUsuario(@Payload() usuarioId: string) {
    return this.alumnosService.findByUsuario(usuarioId);
  }

  @MessagePattern({ cmd: 'find_alumno_by_codigo' })
  findByCodigo(@Payload() codigo: string) {
    return this.alumnosService.findByCodigo(codigo);
  }

  @MessagePattern({ cmd: 'find_alumnos_by_escuela' })
  findByEscuela(@Payload() idEscuela: string) {
    return this.alumnosService.findByEscuela(idEscuela);
  }

  @MessagePattern({ cmd: 'update_alumno' })
  update(@Payload() payload: { id: string; data: UpdateAlumnoDto }) {
    return this.alumnosService.update(payload.id, payload.data);
  }

  @MessagePattern({ cmd: 'remove_alumno' })
  remove(@Payload() id: string) {
    return this.alumnosService.remove(id);
  }
}
