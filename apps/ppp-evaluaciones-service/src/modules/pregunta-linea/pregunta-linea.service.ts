import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePreguntaLineaDto } from './dto/create-pregunta-linea.dto';
import { UpdatePreguntaLineaDto } from './dto/update-pregunta-linea.dto';

@Injectable()
export class PreguntaLineaService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreatePreguntaLineaDto) {
    return this.prisma.preguntaLinea.create({
      data: {
        idLineaFacultad: createDto.idLineaFacultad,
        idEvaluacionPracticante: createDto.idEvaluacionPracticante,
        preguntas: createDto.preguntas,
        estado: createDto.estado ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.preguntaLinea.findMany({
      include: {
        evaluacionPracticante: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const preguntaLinea = await this.prisma.preguntaLinea.findUnique({
      where: { id },
      include: {
        evaluacionPracticante: true,
      },
    });

    if (!preguntaLinea) {
      throw new NotFoundException(`Pregunta Línea con ID ${id} no encontrada`);
    }

    return preguntaLinea;
  }

  async findByLineaFacultad(idLineaFacultad: string) {
    return this.prisma.preguntaLinea.findMany({
      where: { idLineaFacultad },
      include: {
        evaluacionPracticante: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEvaluacionPracticante(idEvaluacionPracticante: string) {
    return this.prisma.preguntaLinea.findMany({
      where: { idEvaluacionPracticante },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: string, updateDto: UpdatePreguntaLineaDto) {
    await this.findOne(id);

    return this.prisma.preguntaLinea.update({
      where: { id },
      data: {
        ...(updateDto.idLineaFacultad && { idLineaFacultad: updateDto.idLineaFacultad }),
        ...(updateDto.idEvaluacionPracticante && { idEvaluacionPracticante: updateDto.idEvaluacionPracticante }),
        ...(updateDto.preguntas && { preguntas: updateDto.preguntas }),
        ...(updateDto.estado !== undefined && { estado: updateDto.estado }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.preguntaLinea.delete({
      where: { id },
    });
  }
}
