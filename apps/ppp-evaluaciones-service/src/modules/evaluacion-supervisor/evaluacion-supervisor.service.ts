import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEvaluacionSupervisorDto } from './dto/create-evaluacion-supervisor.dto';
import { UpdateEvaluacionSupervisorDto } from './dto/update-evaluacion-supervisor.dto';

@Injectable()
export class EvaluacionSupervisorService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateEvaluacionSupervisorDto) {
    return this.prisma.evaluacionSupervisor.create({
      data: {
        idSupervisor: createDto.idSupervisor,
        idAlumno: createDto.idAlumno,
        comentario: createDto.comentario,
        estado: createDto.estado ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.evaluacionSupervisor.findMany({
      include: {
        preguntas: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const evaluacion = await this.prisma.evaluacionSupervisor.findUnique({
      where: { id },
      include: {
        preguntas: {
          include: {
            pregunta: true,
          },
        },
      },
    });

    if (!evaluacion) {
      throw new NotFoundException(`Evaluación Supervisor con ID ${id} no encontrada`);
    }

    return evaluacion;
  }

  async findBySupervisor(idSupervisor: string) {
    return this.prisma.evaluacionSupervisor.findMany({
      where: { idSupervisor },
      include: {
        preguntas: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByAlumno(idAlumno: string) {
    return this.prisma.evaluacionSupervisor.findMany({
      where: { idAlumno },
      include: {
        preguntas: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateDto: UpdateEvaluacionSupervisorDto) {
    await this.findOne(id);

    return this.prisma.evaluacionSupervisor.update({
      where: { id },
      data: {
        ...(updateDto.idSupervisor && { idSupervisor: updateDto.idSupervisor }),
        ...(updateDto.idAlumno && { idAlumno: updateDto.idAlumno }),
        ...(updateDto.comentario !== undefined && { comentario: updateDto.comentario }),
        ...(updateDto.estado !== undefined && { estado: updateDto.estado }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.evaluacionSupervisor.delete({
      where: { id },
    });
  }
}
