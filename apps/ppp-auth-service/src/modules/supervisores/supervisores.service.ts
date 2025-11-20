import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { UpdateSupervisorDto } from './dto/update-supervisor.dto';

@Injectable()
export class SupervisoresService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateSupervisorDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: createDto.usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${createDto.usuarioId} no encontrado`);
    }

    const existing = await this.prisma.supervisor.findUnique({
      where: { usuarioId: createDto.usuarioId },
    });

    if (existing) {
      throw new ConflictException('El usuario ya tiene un perfil de supervisor');
    }

    return this.prisma.supervisor.create({
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
    return this.prisma.supervisor.findMany({
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
    const supervisor = await this.prisma.supervisor.findUnique({
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

    if (!supervisor) {
      throw new NotFoundException(`Supervisor con ID ${id} no encontrado`);
    }

    return supervisor;
  }

  async findByUsuarioId(usuarioId: string) {
    return this.prisma.supervisor.findUnique({
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
    return this.prisma.supervisor.findMany({
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

  async update(id: string, updateDto: UpdateSupervisorDto) {
    await this.findOne(id);

    return this.prisma.supervisor.update({
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

    return this.prisma.supervisor.delete({
      where: { id },
    });
  }
}
