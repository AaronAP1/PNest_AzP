import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateAlumnoDto, UpdateAlumnoDto } from './dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../../../../node_modules/.prisma/client-academic';

@Injectable()
export class AlumnosService {
  constructor(private prisma: PrismaService) {}

  async create(createAlumnoDto: CreateAlumnoDto) {
    try {
      return await this.prisma.alumno.create({
        data: createAlumnoDto,
        include: {
          escuela: {
            include: {
              facultad: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('El código de alumno o usuarioId ya existe');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('La escuela especificada no existe');
        }
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.alumno.findMany({
      include: {
        escuela: {
          include: {
            facultad: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const alumno = await this.prisma.alumno.findUnique({
      where: { id },
      include: {
        escuela: {
          include: {
            facultad: true,
          },
        },
      },
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno con id ${id} no encontrado`);
    }

    return alumno;
  }

  async findByUsuarioId(usuarioId: string) {
    const alumno = await this.prisma.alumno.findUnique({
      where: { usuarioId },
      include: {
        escuela: {
          include: {
            facultad: true,
          },
        },
      },
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno con usuarioId ${usuarioId} no encontrado`);
    }

    return alumno;
  }

  async findByCodigo(codigo: string) {
    const alumno = await this.prisma.alumno.findUnique({
      where: { codigo },
      include: {
        escuela: {
          include: {
            facultad: true,
          },
        },
      },
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno con código ${codigo} no encontrado`);
    }

    return alumno;
  }

  async findByEscuela(idEscuela: string) {
    return await this.prisma.alumno.findMany({
      where: { idEscuela },
      include: {
        escuela: true,
      },
      orderBy: { codigo: 'asc' },
    });
  }

  async update(id: string, updateAlumnoDto: UpdateAlumnoDto) {
    await this.findOne(id);

    try {
      return await this.prisma.alumno.update({
        where: { id },
        data: updateAlumnoDto,
        include: {
          escuela: {
            include: {
              facultad: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('El código de alumno ya existe');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('La escuela especificada no existe');
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.alumno.delete({
      where: { id },
    });
  }
}
