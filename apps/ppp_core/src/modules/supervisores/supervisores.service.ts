import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { UpdateSupervisorDto } from './dto/update-supervisor.dto';

@Injectable()
export class SupervisoresService {
  constructor(private prisma: PrismaService) {}

  async create(createSupervisorDto: CreateSupervisorDto) {
    return this.prisma.supervisor.create({
      data: createSupervisorDto,
      include: {
        escuela: {
          include: {
            facultad: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.supervisor.findMany({
      include: {
        escuela: {
          include: {
            facultad: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const supervisor = await this.prisma.supervisor.findUnique({
      where: { id },
      include: {
        escuela: {
          include: {
            facultad: true,
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
    return this.prisma.supervisor.findMany({
      where: { usuarioId },
      include: {
        escuela: {
          include: {
            facultad: true,
          },
        },
      },
    });
  }

  async findByEscuela(idEscuela: string) {
    return this.prisma.supervisor.findMany({
      where: { idEscuela },
      include: {
        escuela: {
          include: {
            facultad: true,
          },
        },
      },
    });
  }

  async update(id: string, updateSupervisorDto: UpdateSupervisorDto) {
    await this.findOne(id);

    return this.prisma.supervisor.update({
      where: { id },
      data: updateSupervisorDto,
      include: {
        escuela: {
          include: {
            facultad: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.supervisor.delete({
      where: { id },
    });

    return { message: 'Supervisor eliminado correctamente' };
  }
}
