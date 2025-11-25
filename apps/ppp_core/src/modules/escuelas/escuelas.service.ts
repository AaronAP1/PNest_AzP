import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateEscuelaDto, UpdateEscuelaDto } from './dto';
import { PrismaService } from '../../prisma/prisma.service';

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
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Ya existe una escuela con ese código');
      }
      if (error?.code === 'P2003') {
        throw new NotFoundException('La facultad especificada no existe');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.escuela.findMany({
      include: {
        facultad: true,
        lineasFacultad: {
          where: { estado: 'ACTIVO' },
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
        lineasFacultad: {
          where: { estado: 'ACTIVO' },
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
        lineasFacultad: {
          where: { estado: 'ACTIVO' },
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
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Ya existe una escuela con ese código');
      }
      if (error?.code === 'P2003') {
        throw new NotFoundException('La facultad especificada no existe');
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.escuela.delete({
      where: { id },
    });
  }
}
