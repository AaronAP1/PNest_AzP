import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateEmpresaDto, UpdateEmpresaDto } from './dto';
import { PrismaCompaniasService } from '../../prisma/prisma.service';
import { Prisma } from '../../../../../node_modules/.prisma/client-core';

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
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id },
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa con id ${id} no encontrada`);
    }

    return empresa;
  }

  async findByRuc(ruc: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { ruc },
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
    await this.findOne(id);

    return await this.prisma.empresa.delete({
      where: { id },
    });
  }
}
