import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEvaluacionPreguntaDto } from './dto/create-evaluacion-pregunta.dto';
import { UpdateEvaluacionPreguntaDto } from './dto/update-evaluacion-pregunta.dto';

@Injectable()
export class EvaluacionPreguntaService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateEvaluacionPreguntaDto) {
    return this.prisma.evaluacionPregunta.create({
      data: {
        idEvaluacion: createDto.idEvaluacion,
        idPregunta: createDto.idPregunta,
        valor: createDto.valor,
        estado: createDto.estado ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.evaluacionPregunta.findMany({
      include: {
        evaluacion: true,
        pregunta: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const evaluacionPregunta = await this.prisma.evaluacionPregunta.findUnique({
      where: { id },
      include: {
        evaluacion: true,
        pregunta: true,
      },
    });

    if (!evaluacionPregunta) {
      throw new NotFoundException(`Evaluación Pregunta con ID ${id} no encontrada`);
    }

    return evaluacionPregunta;
  }

  async findByEvaluacion(idEvaluacion: string) {
    return this.prisma.evaluacionPregunta.findMany({
      where: { idEvaluacion },
      include: {
        pregunta: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByPregunta(idPregunta: string) {
    return this.prisma.evaluacionPregunta.findMany({
      where: { idPregunta },
      include: {
        evaluacion: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateDto: UpdateEvaluacionPreguntaDto) {
    await this.findOne(id);

    return this.prisma.evaluacionPregunta.update({
      where: { id },
      data: {
        ...(updateDto.idEvaluacion && { idEvaluacion: updateDto.idEvaluacion }),
        ...(updateDto.idPregunta && { idPregunta: updateDto.idPregunta }),
        ...(updateDto.valor && { valor: updateDto.valor }),
        ...(updateDto.estado !== undefined && { estado: updateDto.estado }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.evaluacionPregunta.delete({
      where: { id },
    });
  }
}
