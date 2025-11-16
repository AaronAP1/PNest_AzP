import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCoordinadorDto } from './dto/create-coordinador.dto';
import { UpdateCoordinadorDto } from './dto/update-coordinador.dto';

@Injectable()
export class CoordinadoresService {
  constructor(private prisma: PrismaService) {}

  async create(createCoordinadorDto: CreateCoordinadorDto) {
    return this.prisma.coordinador.create({
      data: createCoordinadorDto,
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
    return this.prisma.coordinador.findMany({
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
    const coordinador = await this.prisma.coordinador.findUnique({
      where: { id },
      include: {
        escuela: {
          include: {
            facultad: true,
          },
        },
      },
    });

    if (!coordinador) {
      throw new NotFoundException(`Coordinador con ID ${id} no encontrado`);
    }

    return coordinador;
  }

  async update(id: string, updateCoordinadorDto: UpdateCoordinadorDto) {
    await this.findOne(id);

    return this.prisma.coordinador.update({
      where: { id },
      data: updateCoordinadorDto,
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

    await this.prisma.coordinador.delete({
      where: { id },
    });

    return { message: 'Coordinador eliminado correctamente' };
  }
}
