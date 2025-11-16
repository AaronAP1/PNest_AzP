import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEvaluacionPracticanteSolicitudDto } from './dto/create-evaluacion-practicante-solicitud.dto';
import { UpdateEvaluacionPracticanteSolicitudDto } from './dto/update-evaluacion-practicante-solicitud.dto';

@Injectable()
export class EvaluacionPracticanteSolicitudService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateEvaluacionPracticanteSolicitudDto) {
    return this.prisma.evaluacionPracticanteSolicitud.create({
      data: {
        idDimensionTransversal: createDto.idDimensionTransversal,
        idEvaluacionPracticante: createDto.idEvaluacionPracticante,
        valor: createDto.valor,
      },
    });
  }

  async findAll() {
    return this.prisma.evaluacionPracticanteSolicitud.findMany({
      include: {
        dimensionTransversal: true,
        evaluacionPracticante: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const evaluacion = await this.prisma.evaluacionPracticanteSolicitud.findUnique({
      where: { id },
      include: {
        dimensionTransversal: true,
        evaluacionPracticante: true,
      },
    });

    if (!evaluacion) {
      throw new NotFoundException(`Evaluación Practicante Solicitud con ID ${id} no encontrada`);
    }

    return evaluacion;
  }

  async findByDimensionTransversal(idDimensionTransversal: string) {
    return this.prisma.evaluacionPracticanteSolicitud.findMany({
      where: { idDimensionTransversal },
      include: {
        evaluacionPracticante: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEvaluacionPracticante(idEvaluacionPracticante: string) {
    return this.prisma.evaluacionPracticanteSolicitud.findMany({
      where: { idEvaluacionPracticante },
      include: {
        dimensionTransversal: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: string, updateDto: UpdateEvaluacionPracticanteSolicitudDto) {
    await this.findOne(id);

    return this.prisma.evaluacionPracticanteSolicitud.update({
      where: { id },
      data: {
        ...(updateDto.idDimensionTransversal && { idDimensionTransversal: updateDto.idDimensionTransversal }),
        ...(updateDto.idEvaluacionPracticante && { idEvaluacionPracticante: updateDto.idEvaluacionPracticante }),
        ...(updateDto.valor && { valor: updateDto.valor }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.evaluacionPracticanteSolicitud.delete({
      where: { id },
    });
  }
}
