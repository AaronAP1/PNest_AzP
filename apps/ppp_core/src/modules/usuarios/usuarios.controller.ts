import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller()
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @MessagePattern({ cmd: 'create_usuario' })
  create(@Payload() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @MessagePattern({ cmd: 'find_all_usuarios' })
  findAll() {
    return this.usuariosService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_usuario' })
  findOne(@Payload() id: string) {
    return this.usuariosService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_usuario_by_email' })
  findByEmail(@Payload() email: string) {
    return this.usuariosService.findByEmail(email);
  }

  @MessagePattern({ cmd: 'update_usuario' })
  update(@Payload() payload: { id: string; data: UpdateUsuarioDto }) {
    return this.usuariosService.update(payload.id, payload.data);
  }

  @MessagePattern({ cmd: 'remove_usuario' })
  remove(@Payload() id: string) {
    return this.usuariosService.remove(id);
  }

  @MessagePattern({ cmd: 'validate_password' })
  validatePassword(@Payload() payload: { plainPassword: string; hashedPassword: string }) {
    return this.usuariosService.validatePassword(
      payload.plainPassword,
      payload.hashedPassword,
    );
  }
}
