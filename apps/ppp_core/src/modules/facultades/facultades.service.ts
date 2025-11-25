import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFacultadDto } from './dto/create-facultad.dto';
import { UpdateFacultadDto } from './dto/update-facultad.dto';

@Injectable()
export class FacultadesService {
  constructor(private prisma: PrismaService) {}

  async create(createFacultadDto: CreateFacultadDto) {
    try {
      return await this.prisma.facultad.create({
        data: createFacultadDto,
        include: {
          escuelas: {
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
        throw new ConflictException('El código de facultad ya existe');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.facultad.findMany({
      include: {
        escuelas: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
            estado: true,
          },
        },
        _count: {
          select: { escuelas: true },
        },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: string) {
    const facultad = await this.prisma.facultad.findUnique({
      where: { id },
      include: {
        escuelas: {
          include: {
            lineasFacultad: {
              where: { estado: 'ACTIVO' },
            },
          },
        },
      },
    });

    if (!facultad) {
      throw new NotFoundException(`Facultad con ID ${id} no encontrada`);
    }

    return facultad;
  }

  async update(id: string, updateFacultadDto: UpdateFacultadDto) {
    try {
      return await this.prisma.facultad.update({
        where: { id },
        data: updateFacultadDto,
        include: {
          escuelas: {
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
        throw new NotFoundException(`Facultad con ID ${id} no encontrada`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('El código de facultad ya existe');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // Verificar si tiene escuelas asociadas
      const facultad = await this.prisma.facultad.findUnique({
        where: { id },
        include: {
          _count: { select: { escuelas: true } },
        },
      });

      if (!facultad) {
        throw new NotFoundException(`Facultad con ID ${id} no encontrada`);
      }

      if (facultad._count.escuelas > 0) {
        throw new ConflictException(
          'No se puede eliminar la facultad porque tiene escuelas asociadas',
        );
      }

      return await this.prisma.facultad.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Facultad con ID ${id} no encontrada`);
      }
      throw error;
    }
  }
}
