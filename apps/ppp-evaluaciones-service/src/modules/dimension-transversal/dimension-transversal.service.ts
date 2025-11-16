import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDimensionTransversalDto } from './dto/create-dimension-transversal.dto';
import { UpdateDimensionTransversalDto } from './dto/update-dimension-transversal.dto';

@Injectable()
export class DimensionTransversalService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateDimensionTransversalDto) {
    return this.prisma.dimensionTransversal.create({
      data: {
        pregunta: createDto.pregunta,
        estado: createDto.estado ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.dimensionTransversal.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllActivas() {
    return this.prisma.dimensionTransversal.findMany({
      where: { estado: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const dimension = await this.prisma.dimensionTransversal.findUnique({
      where: { id },
      include: {
        evaluaciones: true,
      },
    });

    if (!dimension) {
      throw new NotFoundException(`Dimensión Transversal con ID ${id} no encontrada`);
    }

    return dimension;
  }

  async update(id: string, updateDto: UpdateDimensionTransversalDto) {
    await this.findOne(id);

    return this.prisma.dimensionTransversal.update({
      where: { id },
      data: {
        ...(updateDto.pregunta && { pregunta: updateDto.pregunta }),
        ...(updateDto.estado !== undefined && { estado: updateDto.estado }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.dimensionTransversal.delete({
      where: { id },
    });
  }
}
