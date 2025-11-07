import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSecretariaDto } from './dto/create-secretaria.dto';
import { UpdateSecretariaDto } from './dto/update-secretaria.dto';

@Injectable()
export class SecretariasService {
  constructor(private prisma: PrismaService) {}

  async create(createSecretariaDto: CreateSecretariaDto) {
    try {
      return await this.prisma.secretaria.create({
        data: createSecretariaDto,
        include: {
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
      if (error.code === 'P2003') {
        throw new NotFoundException('La escuela especificada no existe');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.secretaria.findMany({
      include: {
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
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: string) {
    const secretaria = await this.prisma.secretaria.findUnique({
      where: { id },
      include: {
        escuela: {
          include: {
            facultad: true,
          },
        },
      },
    });

    if (!secretaria) {
      throw new NotFoundException(`Secretaria con ID ${id} no encontrada`);
    }

    return secretaria;
  }

  async findByEscuela(idEscuela: string) {
    return await this.prisma.secretaria.findMany({
      where: { idEscuela },
      orderBy: { nombre: 'asc' },
    });
  }

  async update(id: string, updateSecretariaDto: UpdateSecretariaDto) {
    try {
      return await this.prisma.secretaria.update({
        where: { id },
        data: updateSecretariaDto,
        include: {
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
        throw new NotFoundException(`Secretaria con ID ${id} no encontrada`);
      }
      if (error.code === 'P2003') {
        throw new NotFoundException('La escuela especificada no existe');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.secretaria.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Secretaria con ID ${id} no encontrada`);
      }
      throw error;
    }
  }
}
