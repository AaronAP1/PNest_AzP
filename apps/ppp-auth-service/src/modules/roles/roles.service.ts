import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRolDto: CreateRolDto) {
    // Verificar si el nombre ya existe
    const existingRol = await this.prisma.rol.findFirst({
      where: { nombre: createRolDto.nombre },
    });

    if (existingRol) {
      throw new ConflictException('Ya existe un rol con ese nombre');
    }

    return this.prisma.rol.create({
      data: createRolDto,
    });
  }

  async findAll() {
    return this.prisma.rol.findMany({
      include: {
        _count: {
          select: { usuarios: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const rol = await this.prisma.rol.findUnique({
      where: { id },
      include: {
        usuarios: {
          include: {
            usuario: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                email: true,
                activo: true,
              },
            },
          },
        },
      },
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return rol;
  }

  async update(id: string, updateRolDto: UpdateRolDto) {
    await this.findOne(id); // Verificar existencia

    // Si se actualiza el nombre, verificar que no exista
    if (updateRolDto.nombre) {
      const existingRol = await this.prisma.rol.findFirst({
        where: {
          nombre: updateRolDto.nombre,
          NOT: { id },
        },
      });

      if (existingRol) {
        throw new ConflictException('Ya existe un rol con ese nombre');
      }
    }

    return this.prisma.rol.update({
      where: { id },
      data: updateRolDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Verificar existencia

    // Verificar si hay usuarios con este rol
    const usuariosCount = await this.prisma.usuarioRol.count({
      where: { rolId: id },
    });

    if (usuariosCount > 0) {
      throw new ConflictException(
        `No se puede eliminar el rol porque tiene ${usuariosCount} usuario(s) asignado(s)`,
      );
    }

    await this.prisma.rol.delete({
      where: { id },
    });

    return { message: 'Rol eliminado correctamente' };
  }

  // ==========================================
  // MÉTODOS PARA GESTIÓN DE PRIVILEGIOS
  // ==========================================

  async assignPrivilegios(rolId: string, privilegiosIds: string[]) {
    // Verificar que el rol existe
    await this.findOne(rolId);

    // Verificar que todos los privilegios existen
    const privilegios = await this.prisma.privilegio.findMany({
      where: { id: { in: privilegiosIds } },
    });

    if (privilegios.length !== privilegiosIds.length) {
      throw new NotFoundException('Uno o más privilegios no existen');
    }

    // Eliminar privilegios existentes del rol
    await this.prisma.rolPrivilegio.deleteMany({
      where: { idRol: rolId },
    });

    // Asignar nuevos privilegios
    const rolPrivilegios = await this.prisma.rolPrivilegio.createMany({
      data: privilegiosIds.map((idPrivilegio) => ({
        idRol: rolId,
        idPrivilegio,
      })),
    });

    return {
      message: `Se asignaron ${rolPrivilegios.count} privilegio(s) al rol`,
      count: rolPrivilegios.count,
    };
  }

  async getPrivilegios(rolId: string) {
    const rol = await this.prisma.rol.findUnique({
      where: { id: rolId },
      include: {
        privilegios: {
          include: {
            privilegio: true,
          },
        },
      },
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID ${rolId} no encontrado`);
    }

    return rol.privilegios.map((rp) => rp.privilegio);
  }

  async removePrivilegio(rolId: string, privilegioId: string) {
    // Verificar que el rol existe
    await this.findOne(rolId);

    // Buscar la relación
    const rolPrivilegio = await this.prisma.rolPrivilegio.findFirst({
      where: {
        idRol: rolId,
        idPrivilegio: privilegioId,
      },
    });

    if (!rolPrivilegio) {
      throw new NotFoundException('El privilegio no está asignado a este rol');
    }

    await this.prisma.rolPrivilegio.delete({
      where: { id: rolPrivilegio.id },
    });

    return { message: 'Privilegio removido del rol correctamente' };
  }
}
