import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaCompaniasService } from '../../prisma/prisma.service';
import { CreateTipoDocumentoDto } from './dto/create-tipo-documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo-documento.dto';

@Injectable()
export class TipoDocumentosService {
  constructor(private prisma: PrismaCompaniasService) {}

  async create(createTipoDocumentoDto: CreateTipoDocumentoDto) {
    return await this.prisma.tipoDocumento.create({
      data: createTipoDocumentoDto,
    });
  }

  async findAll() {
    return await this.prisma.tipoDocumento.findMany({
      include: {
        _count: {
          select: { documentos: true },
        },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: string) {
    const tipoDocumento = await this.prisma.tipoDocumento.findUnique({
      where: { id },
      include: {
        documentos: {
          select: {
            id: true,
            nombreArchivo: true,
            createdAt: true,
          },
        },
      },
    });

    if (!tipoDocumento) {
      throw new NotFoundException(`Tipo de documento con ID ${id} no encontrado`);
    }

    return tipoDocumento;
  }

  async update(id: string, updateTipoDocumentoDto: UpdateTipoDocumentoDto) {
    try {
      return await this.prisma.tipoDocumento.update({
        where: { id },
        data: updateTipoDocumentoDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Tipo de documento con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const tipoDoc = await this.prisma.tipoDocumento.findUnique({
        where: { id },
        include: {
          _count: { select: { documentos: true } },
        },
      });

      if (!tipoDoc) {
        throw new NotFoundException(`Tipo de documento con ID ${id} no encontrado`);
      }

      if (tipoDoc._count.documentos > 0) {
        throw new ConflictException(
          'No se puede eliminar el tipo de documento porque tiene documentos asociados',
        );
      }

      return await this.prisma.tipoDocumento.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Tipo de documento con ID ${id} no encontrado`);
      }
      throw error;
    }
  }
}
