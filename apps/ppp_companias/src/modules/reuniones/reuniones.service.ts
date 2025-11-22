import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaCompaniasService } from '../../prisma/prisma.service';
import { CreateReunionDto, EstadoReunion } from './dto/create-reunion.dto';
import { UpdateReunionDto } from './dto/update-reunion.dto';

@Injectable()
export class ReunionesService {
  constructor(private prisma: PrismaCompaniasService) {}

  async create(createDto: CreateReunionDto) {
    try {
      return await this.prisma.reunion.create({
        data: {
          idSolicitud: createDto.idSolicitud,
          estado: createDto.estado as any || 'pendiente' as any,
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new NotFoundException(`Solicitud PPP con ID ${createDto.idSolicitud} no encontrada`);
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.reunion.findMany({
      include: {
        solicitud: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const reunion = await this.prisma.reunion.findUnique({
      where: { id },
      include: {
        solicitud: true,
      },
    });

    if (!reunion) {
      throw new NotFoundException(`Reunión con ID ${id} no encontrada`);
    }

    return reunion;
  }

  async findBySolicitud(idSolicitud: string) {
    return this.prisma.reunion.findMany({
      where: { idSolicitud },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEstado(estado: EstadoReunion) {
    return this.prisma.reunion.findMany({
      where: { estado: estado as any },
      include: {
        solicitud: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: string, updateDto: UpdateReunionDto) {
    await this.findOne(id);

    try {
      return await this.prisma.reunion.update({
        where: { id },
        data: {
          ...(updateDto.estado && { estado: updateDto.estado as any }),
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new NotFoundException(`Solicitud PPP no encontrada`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.reunion.delete({
      where: { id },
    });
  }

  async countByEstado() {
    const estados = ['pendiente', 'realizada', 'cancelada'];
    const counts = await Promise.all(
      estados.map(async (estado) => ({
        estado,
        count: await this.prisma.reunion.count({ where: { estado: estado as any } }),
      }))
    );
    return counts;
  }
}

