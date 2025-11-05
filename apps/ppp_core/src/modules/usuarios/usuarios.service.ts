import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioResponseDto } from './dto/usuario-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioResponseDto> {
    // Verificar si el email ya existe
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email: createUsuarioDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Verificar que el rol existe
    const rol = await this.prisma.rol.findUnique({
      where: { id: createUsuarioDto.idRol },
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID ${createUsuarioDto.idRol} no encontrado`);
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(createUsuarioDto.contraseña, 10);

    // Crear usuario y asignar rol
    const { idRol, ...userData } = createUsuarioDto;
    const usuario = await this.prisma.usuario.create({
      data: {
        ...userData,
        contraseña: hashedPassword,
        roles: {
          create: {
            rolId: idRol,
          },
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

    return new UsuarioResponseDto(usuario as any);
  }

  async findAll(): Promise<UsuarioResponseDto[]> {
    const usuarios = await this.prisma.usuario.findMany({
      include: {
        roles: {
          include: {
            rol: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return usuarios.map((usuario) => new UsuarioResponseDto(usuario as any));
  }

  async findOne(id: string): Promise<UsuarioResponseDto> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            rol: true,
          },
        },
        alumno: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return new UsuarioResponseDto(usuario as any);
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

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioResponseDto> {
    await this.findOne(id); // Verifica que existe

    // Si se actualiza la contraseña, hashearla
    if (updateUsuarioDto.contraseña) {
      updateUsuarioDto.contraseña = await bcrypt.hash(updateUsuarioDto.contraseña, 10);
    }

    const { idRol, ...updateData } = updateUsuarioDto;
    
    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: updateData,
      include: {
        roles: {
          include: {
            rol: true,
          },
        },
      },
    });

    return new UsuarioResponseDto(usuario as any);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Verifica que existe

    await this.prisma.usuario.delete({
      where: { id },
    });
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
