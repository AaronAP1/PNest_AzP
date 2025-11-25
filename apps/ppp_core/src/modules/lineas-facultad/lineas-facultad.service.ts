import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLineaFacultadDto } from './dto/create-linea-facultad.dto';
import { UpdateLineaFacultadDto } from './dto/update-linea-facultad.dto';

@Injectable()
export class LineasFacultadService {
  constructor(private prisma: PrismaService) {}

  async create(createLineaFacultadDto: CreateLineaFacultadDto) {
    return this.prisma.lineaFacultad.create({
      data: createLineaFacultadDto,
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
    return this.prisma.lineaFacultad.findMany({
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
    const linea = await this.prisma.lineaFacultad.findUnique({
      where: { id },
      include: {
        escuela: {
          include: {
            facultad: true,
          },
        },
      },
    });

    if (!linea) {
      throw new NotFoundException(`Línea de facultad con ID ${id} no encontrada`);
    }

    return linea;
  }

  async findByEscuela(idEscuela: string) {
    return this.prisma.lineaFacultad.findMany({
      where: { idEscuela, estado: 'ACTIVO' },
      include: {
        escuela: {
          include: {
            facultad: true,
          },
        },
      },
    });
  }

  async update(id: string, updateLineaFacultadDto: UpdateLineaFacultadDto) {
    await this.findOne(id);

    return this.prisma.lineaFacultad.update({
      where: { id },
      data: updateLineaFacultadDto,
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

    await this.prisma.lineaFacultad.delete({
      where: { id },
    });

    return { message: 'Línea de facultad eliminada correctamente' };
  }
}
