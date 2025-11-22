import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateDocumentoDto, UpdateDocumentoDto } from './dto';
import { PrismaCompaniasService } from '../../prisma/prisma.service';

@Injectable()
export class DocumentosService {
  constructor(private prisma: PrismaCompaniasService) {}

  async create(createDocumentoDto: CreateDocumentoDto) {
    // Validate that TipoDocumento exists
    const tipoDocumento = await this.prisma.tipoDocumento.findUnique({
      where: { id: createDocumentoDto.idTipoDocumento },
    });

    if (!tipoDocumento) {
      throw new BadRequestException(
        `TipoDocumento con id ${createDocumentoDto.idTipoDocumento} no existe`,
      );
    }

    return await this.prisma.documento.create({
      data: createDocumentoDto,
      include: {
        tipoDocumento: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.documento.findMany({
      include: {
        tipoDocumento: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const documento = await this.prisma.documento.findUnique({
      where: { id },
      include: {
        tipoDocumento: true,
      },
    });

    if (!documento) {
      throw new NotFoundException(`Documento con id ${id} no encontrado`);
    }

    return documento;
  }

  async findByTipoDocumento(idTipoDocumento: string) {
    const tipoDocumento = await this.prisma.tipoDocumento.findUnique({
      where: { id: idTipoDocumento },
    });

    if (!tipoDocumento) {
      throw new NotFoundException(
        `TipoDocumento con id ${idTipoDocumento} no encontrado`,
      );
    }

    return await this.prisma.documento.findMany({
      where: { idTipoDocumento },
      include: {
        tipoDocumento: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findBySubidoPor(subidoPor: string) {
    return await this.prisma.documento.findMany({
      where: { subidoPor },
      include: {
        tipoDocumento: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByGeneradoPor(generadoPor: string) {
    return await this.prisma.documento.findMany({
      where: { generadoPor },
      include: {
        tipoDocumento: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateDocumentoDto: UpdateDocumentoDto) {
    await this.findOne(id); // Validates existence

    // If updating idTipoDocumento, validate it exists
    if (updateDocumentoDto.idTipoDocumento) {
      const tipoDocumento = await this.prisma.tipoDocumento.findUnique({
        where: { id: updateDocumentoDto.idTipoDocumento },
      });

      if (!tipoDocumento) {
        throw new BadRequestException(
          `TipoDocumento con id ${updateDocumentoDto.idTipoDocumento} no existe`,
        );
      }
    }

    return await this.prisma.documento.update({
      where: { id },
      data: updateDocumentoDto,
      include: {
        tipoDocumento: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Validates existence

    // Note: The database has onDelete: SetNull configured for the relation,
    // so deleting a documento will set documentoId to null in related cartas
    return await this.prisma.documento.delete({
      where: { id },
    });
  }
}
