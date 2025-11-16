import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEvaluacionPracticanteDto } from './dto/create-evaluacion-practicante.dto';
import { UpdateEvaluacionPracticanteDto } from './dto/update-evaluacion-practicante.dto';

@Injectable()
export class EvaluacionPracticanteService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateEvaluacionPracticanteDto) {
    return this.prisma.evaluacionPracticante.create({
      data: {
        idSolicitud: createDto.idSolicitud,
        comentario: createDto.comentario,
        estado: createDto.estado ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.evaluacionPracticante.findMany({
      include: {
        preguntasLinea: true,
        evaluacionPracticanteSolicitud: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const evaluacion = await this.prisma.evaluacionPracticante.findUnique({
      where: { id },
      include: {
        preguntasLinea: true,
        evaluacionPracticanteSolicitud: {
          include: {
            dimensionTransversal: true,
          },
        },
      },
    });

    if (!evaluacion) {
      throw new NotFoundException(`Evaluación Practicante con ID ${id} no encontrada`);
    }

    return evaluacion;
  }

  async findBySolicitud(idSolicitud: string) {
    return this.prisma.evaluacionPracticante.findMany({
      where: { idSolicitud },
      include: {
        preguntasLinea: true,
        evaluacionPracticanteSolicitud: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateDto: UpdateEvaluacionPracticanteDto) {
    await this.findOne(id);

    return this.prisma.evaluacionPracticante.update({
      where: { id },
      data: {
        ...(updateDto.idSolicitud && { idSolicitud: updateDto.idSolicitud }),
        ...(updateDto.comentario !== undefined && { comentario: updateDto.comentario }),
        ...(updateDto.estado !== undefined && { estado: updateDto.estado }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.evaluacionPracticante.delete({
      where: { id },
    });
  }
}
