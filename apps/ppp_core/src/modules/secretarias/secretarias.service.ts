import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateSecretariaDto, UpdateSecretariaDto } from './dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../../../../node_modules/.prisma/client-academic';

@Injectable()
export class SecretariasService {
  constructor(private prisma: PrismaService) {}

  async create(createSecretariaDto: CreateSecretariaDto) {
    try {
      return await this.prisma.secretaria.create({
        data: createSecretariaDto,
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
        if (error.code === 'P2003') {
          throw new NotFoundException('La escuela especificada no existe');
        }
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.secretaria.findMany({
      include: {
        escuela: {
          include: {
            facultad: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
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
      throw new NotFoundException(`Secretaria con id ${id} no encontrada`);
    }

    return secretaria;
  }

  async findByEscuela(idEscuela: string) {
    return await this.prisma.secretaria.findMany({
      where: { idEscuela },
      include: {
        escuela: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateSecretariaDto: UpdateSecretariaDto) {
    await this.findOne(id);

    try {
      return await this.prisma.secretaria.update({
        where: { id },
        data: updateSecretariaDto,
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
        if (error.code === 'P2003') {
          throw new NotFoundException('La escuela especificada no existe');
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.secretaria.delete({
      where: { id },
    });
  }
}
