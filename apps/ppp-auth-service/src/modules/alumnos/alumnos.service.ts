import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

@Injectable()
export class AlumnosService {
  constructor(private prisma: PrismaService) {}

  async create(createAlumnoDto: CreateAlumnoDto) {
    // Verificar si el usuario existe
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: createAlumnoDto.usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${createAlumnoDto.usuarioId} no encontrado`);
    }

    // Verificar si el usuario ya tiene un perfil de alumno
    const existingAlumno = await this.prisma.alumno.findUnique({
      where: { usuarioId: createAlumnoDto.usuarioId },
    });

    if (existingAlumno) {
      throw new ConflictException('El usuario ya tiene un perfil de alumno');
    }

    // Verificar si el código ya existe
    const existingCodigo = await this.prisma.alumno.findFirst({
      where: { codigo: createAlumnoDto.codigo },
    });

    if (existingCodigo) {
      throw new ConflictException(`El código "${createAlumnoDto.codigo}" ya está registrado`);
    }

    return this.prisma.alumno.create({
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
      },
    });
  }

  async findAll() {
    return this.prisma.alumno.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            telefono: true,
            activo: true,
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
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            telefono: true,
            activo: true,
          },
        },
      },
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
    }

    return alumno;
  }

  async findByUsuarioId(usuarioId: string) {
    return this.prisma.alumno.findUnique({
      where: { usuarioId },
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            telefono: true,
            activo: true,
          },
        },
      },
    });
  }

  async findByEscuela(idEscuela: string) {
    return this.prisma.alumno.findMany({
      where: { idEscuela },
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            telefono: true,
            activo: true,
          },
        },
      },
      orderBy: {
        codigo: 'asc',
      },
    });
  }

  async update(id: string, updateAlumnoDto: UpdateAlumnoDto) {
    await this.findOne(id); // Verificar existencia

    // Verificar código único si se está actualizando
    if (updateAlumnoDto.codigo) {
      const existingCodigo = await this.prisma.alumno.findFirst({
        where: {
          codigo: updateAlumnoDto.codigo,
          NOT: { id },
        },
      });

      if (existingCodigo) {
        throw new ConflictException(`El código "${updateAlumnoDto.codigo}" ya está registrado`);
      }
    }

    return this.prisma.alumno.update({
      where: { id },
      data: updateAlumnoDto,
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            telefono: true,
            activo: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Verificar existencia

    return this.prisma.alumno.delete({
      where: { id },
    });
  }
}
