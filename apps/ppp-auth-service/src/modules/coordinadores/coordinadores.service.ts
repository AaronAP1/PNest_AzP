import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCoordinadorDto } from './dto/create-coordinador.dto';
import { UpdateCoordinadorDto } from './dto/update-coordinador.dto';

@Injectable()
export class CoordinadoresService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateCoordinadorDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: createDto.usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${createDto.usuarioId} no encontrado`);
    }

    const existing = await this.prisma.coordinador.findUnique({
      where: { usuarioId: createDto.usuarioId },
    });

    if (existing) {
      throw new ConflictException('El usuario ya tiene un perfil de coordinador');
    }

    return this.prisma.coordinador.create({
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
    return this.prisma.coordinador.findMany({
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
    const coordinador = await this.prisma.coordinador.findUnique({
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

    if (!coordinador) {
      throw new NotFoundException(`Coordinador con ID ${id} no encontrado`);
    }

    return coordinador;
  }

  async findByUsuarioId(usuarioId: string) {
    return this.prisma.coordinador.findUnique({
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
    return this.prisma.coordinador.findMany({
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

  async update(id: string, updateDto: UpdateCoordinadorDto) {
    await this.findOne(id);

    return this.prisma.coordinador.update({
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

    return this.prisma.coordinador.delete({
      where: { id },
    });
  }
}
