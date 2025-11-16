import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateEscuelaDto, UpdateEscuelaDto } from './dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../../../../node_modules/.prisma/client-academic';

@Injectable()
export class EscuelasService {
  constructor(private prisma: PrismaService) {}

  async create(createEscuelaDto: CreateEscuelaDto) {
    try {
      return await this.prisma.escuela.create({
        data: createEscuelaDto,
        include: {
          facultad: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Ya existe una escuela con ese código');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('La facultad especificada no existe');
        }
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.escuela.findMany({
      include: {
        facultad: true,
        _count: {
          select: {
            alumnos: true,
            secretarias: true,
            supervisores: true,
            coordinadores: true,
          },
        },
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const escuela = await this.prisma.escuela.findUnique({
      where: { id },
      include: {
        facultad: true,
        alumnos: {
          orderBy: { codigo: 'asc' },
        },
        secretarias: true,
        supervisores: true,
        coordinadores: true,
        lineasFacultad: {
          where: { estado: true },
        },
      },
    });

    if (!escuela) {
      throw new NotFoundException(`Escuela con id ${id} no encontrada`);
    }

    return escuela;
  }

  async findByFacultad(idFacultad: string) {
    return await this.prisma.escuela.findMany({
      where: { idFacultad },
      include: {
        facultad: true,
        _count: {
          select: {
            alumnos: true,
            secretarias: true,
          },
        },
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async update(id: string, updateEscuelaDto: UpdateEscuelaDto) {
    await this.findOne(id);

    try {
      return await this.prisma.escuela.update({
        where: { id },
        data: updateEscuelaDto,
        include: {
          facultad: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Ya existe una escuela con ese código');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('La facultad especificada no existe');
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    const escuela = await this.findOne(id);

    if (escuela.alumnos.length > 0) {
      throw new ConflictException(
        `No se puede eliminar la escuela porque tiene ${escuela.alumnos.length} alumno(s) asociado(s)`,
      );
    }

    await this.prisma.escuela.delete({
      where: { id },
    });
  }
}
