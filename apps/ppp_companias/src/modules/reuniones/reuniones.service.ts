import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaCompaniasService } from '../../prisma/prisma.service';
import { CreateReunionDto } from './dto/create-reunion.dto';
import { UpdateReunionDto } from './dto/update-reunion.dto';
import { ESTADO_REUNION } from '../../constants/estados.constants';

@Injectable()
export class ReunionesService {
  constructor(private prisma: PrismaCompaniasService) {}

  async create(createDto: CreateReunionDto) {
    try {
      return await this.prisma.reunion.create({
        data: {
          idSolicitud: createDto.idSolicitud,
          estado: createDto.estado ?? ESTADO_REUNION.PENDIENTE,
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

  async findByEstado(estado: number) {
    return this.prisma.reunion.findMany({
      where: { estado },
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
          ...(updateDto.estado !== undefined && { estado: updateDto.estado }),
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
    const estados = [
      { nombre: 'PENDIENTE', valor: ESTADO_REUNION.PENDIENTE },
      { nombre: 'REALIZADA', valor: ESTADO_REUNION.REALIZADA },
      { nombre: 'CANCELADA', valor: ESTADO_REUNION.CANCELADA },
    ];
    const counts = await Promise.all(
      estados.map(async (estado) => ({
        estado: estado.nombre,
        valor: estado.valor,
        count: await this.prisma.reunion.count({ where: { estado: estado.valor } }),
      }))
    );
    return counts;
  }
}

