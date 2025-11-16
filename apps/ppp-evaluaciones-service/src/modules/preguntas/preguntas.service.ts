import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePreguntaDto } from './dto/create-pregunta.dto';
import { UpdatePreguntaDto } from './dto/update-pregunta.dto';

@Injectable()
export class PreguntasService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreatePreguntaDto) {
    return this.prisma.pregunta.create({
      data: {
        preguntas: createDto.preguntas,
        estado: createDto.estado ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.pregunta.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllActivas() {
    return this.prisma.pregunta.findMany({
      where: { estado: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const pregunta = await this.prisma.pregunta.findUnique({
      where: { id },
      include: {
        evaluaciones: true,
      },
    });

    if (!pregunta) {
      throw new NotFoundException(`Pregunta con ID ${id} no encontrada`);
    }

    return pregunta;
  }

  async update(id: string, updateDto: UpdatePreguntaDto) {
    await this.findOne(id);

    return this.prisma.pregunta.update({
      where: { id },
      data: {
        ...(updateDto.preguntas && { preguntas: updateDto.preguntas }),
        ...(updateDto.estado !== undefined && { estado: updateDto.estado }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.pregunta.delete({
      where: { id },
    });
  }
}
