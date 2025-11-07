import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEscuelaDto } from './dto/create-escuela.dto';
import { UpdateEscuelaDto } from './dto/update-escuela.dto';

@Injectable()
export class EscuelasService {
  constructor(private prisma: PrismaService) {}

  async create(createEscuelaDto: CreateEscuelaDto) {
    try {
      return await this.prisma.escuela.create({
        data: createEscuelaDto,
        include: {
          facultad: {
            select: {
              id: true,
              nombre: true,
              codigo: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('El código de escuela ya existe');
      }
      if (error.code === 'P2003') {
        throw new NotFoundException('La facultad especificada no existe');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.escuela.findMany({
      include: {
        facultad: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
          },
        },
        _count: {
          select: {
            alumnos: true,
          },
        },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: string) {
    const escuela = await this.prisma.escuela.findUnique({
      where: { id },
      include: {
        facultad: true,
        alumnos: {
          include: {
            usuario: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            alumnos: true,
          },
        },
      },
    });

    if (!escuela) {
      throw new NotFoundException(`Escuela con ID ${id} no encontrada`);
    }

    return escuela;
  }

  async findByFacultad(idFacultad: string) {
    return await this.prisma.escuela.findMany({
      where: { idFacultad },
      include: {
        _count: {
          select: {
            alumnos: true,
          },
        },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async update(id: string, updateEscuelaDto: UpdateEscuelaDto) {
    try {
      return await this.prisma.escuela.update({
        where: { id },
        data: updateEscuelaDto,
        include: {
          facultad: {
            select: {
              id: true,
              nombre: true,
              codigo: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Escuela con ID ${id} no encontrada`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('El código de escuela ya existe');
      }
      if (error.code === 'P2003') {
        throw new NotFoundException('La facultad especificada no existe');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const escuela = await this.prisma.escuela.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              alumnos: true,
            },
          },
        },
      });

      if (!escuela) {
        throw new NotFoundException(`Escuela con ID ${id} no encontrada`);
      }

      if (escuela._count.alumnos > 0) {
        throw new ConflictException(
          'No se puede eliminar la escuela porque tiene alumnos asociados',
        );
      }

      return await this.prisma.escuela.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Escuela con ID ${id} no encontrada`);
      }
      throw error;
    }
  }
}
