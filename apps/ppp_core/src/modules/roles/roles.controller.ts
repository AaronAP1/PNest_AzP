import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern({ cmd: 'create_rol' })
  create(@Payload() createRolDto: CreateRolDto) {
    return this.rolesService.create(createRolDto);
  }

  @MessagePattern({ cmd: 'find_all_roles' })
  findAll() {
    return this.rolesService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_rol' })
  findOne(@Payload() id: string) {
    return this.rolesService.findOne(id);
  }

  @MessagePattern({ cmd: 'remove_rol' })
  remove(@Payload() id: string) {
    return this.rolesService.remove(id);
  }
}
