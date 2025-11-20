import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePrivilegioDto } from './dto/create-privilegio.dto';
import { UpdatePrivilegioDto } from './dto/update-privilegio.dto';

@Injectable()
export class PrivilegiosService {
  constructor(private prisma: PrismaService) {}

  async create(createPrivilegioDto: CreatePrivilegioDto) {
    // Verificar si el privilegio ya existe
    const existing = await this.prisma.privilegio.findFirst({
      where: { nombre: createPrivilegioDto.nombre },
    });

    if (existing) {
      throw new ConflictException(`El privilegio "${createPrivilegioDto.nombre}" ya existe`);
    }

    return this.prisma.privilegio.create({
      data: createPrivilegioDto,
    });
  }

  async findAll() {
    return this.prisma.privilegio.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        rolesPrivilegios: {
          include: {
            rol: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const privilegio = await this.prisma.privilegio.findUnique({
      where: { id },
      include: {
        rolesPrivilegios: {
          include: {
            rol: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
      },
    });

    if (!privilegio) {
      throw new NotFoundException(`Privilegio con ID ${id} no encontrado`);
    }

    return privilegio;
  }

  async update(id: string, updatePrivilegioDto: UpdatePrivilegioDto) {
    await this.findOne(id); // Verificar existencia

    // Verificar si el nuevo nombre ya existe (si se está actualizando)
    if (updatePrivilegioDto.nombre) {
      const existing = await this.prisma.privilegio.findFirst({
        where: {
          nombre: updatePrivilegioDto.nombre,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException(`El privilegio "${updatePrivilegioDto.nombre}" ya existe`);
      }
    }

    return this.prisma.privilegio.update({
      where: { id },
      data: updatePrivilegioDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Verificar existencia

    return this.prisma.privilegio.delete({
      where: { id },
    });
  }
}
