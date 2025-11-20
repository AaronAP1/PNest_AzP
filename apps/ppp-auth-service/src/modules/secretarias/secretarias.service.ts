import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSecretariaDto } from './dto/create-secretaria.dto';
import { UpdateSecretariaDto } from './dto/update-secretaria.dto';

@Injectable()
export class SecretariasService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateSecretariaDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: createDto.usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${createDto.usuarioId} no encontrado`);
    }

    const existing = await this.prisma.secretaria.findUnique({
      where: { usuarioId: createDto.usuarioId },
    });

    if (existing) {
      throw new ConflictException('El usuario ya tiene un perfil de secretaria');
    }

    return this.prisma.secretaria.create({
      data: createDto,
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            telefono: true,
            activo: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.secretaria.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            telefono: true,
            activo: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const secretaria = await this.prisma.secretaria.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            telefono: true,
            activo: true,
          },
        },
      },
    });

    if (!secretaria) {
      throw new NotFoundException(`Secretaria con ID ${id} no encontrada`);
    }

    return secretaria;
  }

  async findByUsuarioId(usuarioId: string) {
    return this.prisma.secretaria.findUnique({
      where: { usuarioId },
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            telefono: true,
            activo: true,
          },
        },
      },
    });
  }

  async findByEscuela(idEscuela: string) {
    return this.prisma.secretaria.findMany({
      where: { idEscuela },
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            telefono: true,
            activo: true,
          },
        },
      },
    });
  }

  async update(id: string, updateDto: UpdateSecretariaDto) {
    await this.findOne(id);

    return this.prisma.secretaria.update({
      where: { id },
      data: updateDto,
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            telefono: true,
            activo: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.secretaria.delete({
      where: { id },
    });
  }
}
