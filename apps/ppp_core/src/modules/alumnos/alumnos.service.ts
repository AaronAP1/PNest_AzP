import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

@Injectable()
export class AlumnosService {
  constructor(private prisma: PrismaService) {}

  async create(createAlumnoDto: CreateAlumnoDto) {
    try {
      return await this.prisma.alumno.create({
        data: createAlumnoDto,
        include: {
          usuario: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              email: true,
              telefono: true,
            },
          },
          escuela: {
            select: {
              id: true,
              nombre: true,
              codigo: true,
              facultad: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('El código de alumno ya existe o el usuario ya está registrado como alumno');
      }
      if (error.code === 'P2003') {
        throw new NotFoundException('El usuario o escuela especificado no existe');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.alumno.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            activo: true,
          },
        },
        escuela: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
            facultad: {
              select: {
                nombre: true,
              },
            },
          },
        },
      },
      orderBy: { codigo: 'asc' },
    });
  }

  async findOne(id: string) {
    const alumno = await this.prisma.alumno.findUnique({
      where: { id },
      include: {
        usuario: {
          include: {
            roles: {
              include: {
                rol: true,
              },
            },
          },
        },
        escuela: {
          include: {
            facultad: true,
          },
        },
      },
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
    }

    return alumno;
  }

  async findByUsuario(usuarioId: string) {
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
      throw new NotFoundException(`No se encontró alumno para el usuario ${usuarioId}`);
    }

    return alumno;
  }

  async findByCodigo(codigo: string) {
    const alumno = await this.prisma.alumno.findUnique({
      where: { codigo },
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
          },
        },
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
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
          },
        },
      },
      orderBy: { codigo: 'asc' },
    });
  }

  async update(id: string, updateAlumnoDto: UpdateAlumnoDto) {
    try {
      return await this.prisma.alumno.update({
        where: { id },
        data: updateAlumnoDto,
        include: {
          usuario: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              email: true,
            },
          },
          escuela: {
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
        throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('El código de alumno ya existe');
      }
      if (error.code === 'P2003') {
        throw new NotFoundException('La escuela especificada no existe');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.alumno.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
      }
      throw error;
    }
  }
}
