import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const { rolesIds, contraseña, ...userData } = createUsuarioDto;

    // Verificar si el email ya existe
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear usuario con roles
    const usuario = await this.prisma.usuario.create({
      data: {
        ...userData,
        contraseña: hashedPassword,
        roles: rolesIds
          ? {
              create: rolesIds.map((rolId) => ({ rolId })),
            }
          : undefined,
      },
      include: {
        roles: {
          include: {
            rol: true,
          },
        },
      },
    });

    // Omitir contraseña en respuesta
    const { contraseña: _, ...result } = usuario;
    return result;
  }

  async findAll() {
    const usuarios = await this.prisma.usuario.findMany({
      include: {
        roles: {
          include: {
            rol: true,
          },
        },
        alumno: true,
        secretaria: true,
        supervisor: true,
        coordinador: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return usuarios.map(({ contraseña, ...usuario }) => usuario);
  }

  async findOne(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            rol: true,
          },
        },
        alumno: true,
        secretaria: true,
        supervisor: true,
        coordinador: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const { contraseña, ...result } = usuario;
    return result;
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            rol: true,
          },
        },
      },
    });
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id); // Verificar existencia

    const { rolesIds, contraseña, ...userData } = updateUsuarioDto;

    // Hash de contraseña si se proporciona
    const hashedPassword = contraseña
      ? await bcrypt.hash(contraseña, 10)
      : undefined;

    // Si se proporcionan roles, actualizar relaciones
    if (rolesIds) {
      // Eliminar roles actuales
      await this.prisma.usuarioRol.deleteMany({
        where: { usuarioId: id },
      });
    }

    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: {
        ...userData,
        ...(hashedPassword && { contraseña: hashedPassword }),
        ...(rolesIds && {
          roles: {
            create: rolesIds.map((rolId) => ({ rolId })),
          },
        }),
      },
      include: {
        roles: {
          include: {
            rol: true,
          },
        },
      },
    });

    const { contraseña: _, ...result } = usuario;
    return result;
  }

  async remove(id: string) {
    await this.findOne(id); // Verificar existencia

    await this.prisma.usuario.delete({
      where: { id },
    });

    return { message: 'Usuario eliminado correctamente' };
  }

  async assignRoles(usuarioId: string, rolesIds: string[]) {
    await this.findOne(usuarioId); // Verificar existencia

    // Eliminar roles actuales
    await this.prisma.usuarioRol.deleteMany({
      where: { usuarioId },
    });

    // Asignar nuevos roles
    const usuario = await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        roles: {
          create: rolesIds.map((rolId) => ({ rolId })),
        },
      },
      include: {
        roles: {
          include: {
            rol: true,
          },
        },
      },
    });

    const { contraseña, ...result } = usuario;
    return result;
  }
}
