import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateEmpresaDto, UpdateEmpresaDto } from './dto';
import { PrismaCompaniasService } from '../../prisma/prisma.service';
import { Prisma } from '../../../../../node_modules/.prisma/client-companias';

@Injectable()
export class EmpresasService {
  constructor(private prisma: PrismaCompaniasService) {}

  async create(createEmpresaDto: CreateEmpresaDto) {
    try {
      return await this.prisma.empresa.create({
        data: createEmpresaDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Ya existe una empresa con el RUC ${createEmpresaDto.ruc}`,
          );
        }
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.empresa.findMany({
      include: {
        _count: {
          select: {
            cartasPresentacion: true,
          },
        },
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            cartasPresentacion: true,
          },
        },
      },
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa con id ${id} no encontrada`);
    }

    return empresa;
  }

  async findByRuc(ruc: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { ruc },
      include: {
        _count: {
          select: {
            cartasPresentacion: true,
          },
        },
      },
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa con RUC ${ruc} no encontrada`);
    }

    return empresa;
  }

  async findBySector(sector: string) {
    return await this.prisma.empresa.findMany({
      where: {
        sector: {
          contains: sector,
          mode: 'insensitive',
        },
      },
      include: {
        _count: {
          select: {
            cartasPresentacion: true,
          },
        },
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async update(id: string, updateEmpresaDto: UpdateEmpresaDto) {
    await this.findOne(id); // Validates existence

    try {
      return await this.prisma.empresa.update({
        where: { id },
        data: updateEmpresaDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Ya existe una empresa con el RUC ${updateEmpresaDto.ruc}`,
          );
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    const empresa = await this.findOne(id); // Validates existence

    // Check if empresa is being used in cartas_presentacion
    if (empresa._count.cartasPresentacion > 0) {
      throw new BadRequestException(
        `No se puede eliminar la empresa porque tiene ${empresa._count.cartasPresentacion} carta(s) de presentación asociadas`,
      );
    }

    return await this.prisma.empresa.delete({
      where: { id },
    });
  }
}
