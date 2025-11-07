import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCartaPresentacionDto, UpdateCartaPresentacionDto } from './dto';
import { PrismaCompaniasService } from '../../prisma/prisma.service';
import { CartaEstado } from '../../../../../node_modules/.prisma/client-companias';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CartasPresentacionService {
  constructor(
    private prisma: PrismaCompaniasService,
    @Inject('PPP_CORE_SERVICE') private coreClient: ClientProxy,
  ) {}

  async create(createCartaPresentacionDto: CreateCartaPresentacionDto) {
    // Validate alumno exists in ppp_core
    try {
      const alumno = await firstValueFrom(
        this.coreClient.send(
          { cmd: 'find_one_alumno' },
          createCartaPresentacionDto.idAlumno,
        ),
      );
      if (!alumno) {
        throw new NotFoundException(
          `Alumno con id ${createCartaPresentacionDto.idAlumno} no encontrado`,
        );
      }
    } catch (error) {
      throw new NotFoundException(
        `Alumno con id ${createCartaPresentacionDto.idAlumno} no encontrado`,
      );
    }

    // Validate secretaria exists in ppp_core if provided
    if (createCartaPresentacionDto.idSecretaria) {
      try {
        const secretaria = await firstValueFrom(
          this.coreClient.send(
            { cmd: 'find_one_secretaria' },
            createCartaPresentacionDto.idSecretaria,
          ),
        );
        if (!secretaria) {
          throw new NotFoundException(
            `Secretaria con id ${createCartaPresentacionDto.idSecretaria} no encontrada`,
          );
        }
      } catch (error) {
        throw new NotFoundException(
          `Secretaria con id ${createCartaPresentacionDto.idSecretaria} no encontrada`,
        );
      }
    }

    // Validate empresa exists locally
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: createCartaPresentacionDto.idEmpresa },
    });
    if (!empresa) {
      throw new BadRequestException(
        `Empresa con id ${createCartaPresentacionDto.idEmpresa} no existe`,
      );
    }

    // Validate documento exists locally if provided
    if (createCartaPresentacionDto.documentoId) {
      const documento = await this.prisma.documento.findUnique({
        where: { id: createCartaPresentacionDto.documentoId },
      });
      if (!documento) {
        throw new BadRequestException(
          `Documento con id ${createCartaPresentacionDto.documentoId} no existe`,
        );
      }
    }

    return await this.prisma.cartaPresentacion.create({
      data: {
        idAlumno: createCartaPresentacionDto.idAlumno,
        idEmpresa: createCartaPresentacionDto.idEmpresa,
        posicion: createCartaPresentacionDto.posicion,
        fechaInicio: new Date(createCartaPresentacionDto.fechaInicio),
        estado: createCartaPresentacionDto.estado || CartaEstado.draft,
        ...(createCartaPresentacionDto.idSecretaria && { idSecretaria: createCartaPresentacionDto.idSecretaria }),
        ...(createCartaPresentacionDto.documentoId && { documentoId: createCartaPresentacionDto.documentoId }),
        ...(createCartaPresentacionDto.motivoRechazo && { motivoRechazo: createCartaPresentacionDto.motivoRechazo }),
      },
      include: {
        empresa: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.cartaPresentacion.findMany({
      include: {
        empresa: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const carta = await this.prisma.cartaPresentacion.findUnique({
      where: { id },
      include: {
        empresa: true,
      },
    });

    if (!carta) {
      throw new NotFoundException(
        `Carta de presentación con id ${id} no encontrada`,
      );
    }

    return carta;
  }

  async findByUsuario(idAlumno: string) {
    return await this.prisma.cartaPresentacion.findMany({
      where: { idAlumno },
      include: {
        empresa: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByEmpresa(idEmpresa: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: idEmpresa },
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa con id ${idEmpresa} no encontrada`);
    }

    return await this.prisma.cartaPresentacion.findMany({
      where: { idEmpresa },
      include: {
        empresa: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByEstado(estado: CartaEstado) {
    return await this.prisma.cartaPresentacion.findMany({
      where: { estado },
      include: {
        empresa: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateCartaPresentacionDto: UpdateCartaPresentacionDto) {
    await this.findOne(id); // Validates existence

    // Validate alumno if being updated
    if (updateCartaPresentacionDto.idAlumno) {
      try {
        const alumno = await firstValueFrom(
          this.coreClient.send(
            { cmd: 'find_one_alumno' },
            updateCartaPresentacionDto.idAlumno,
          ),
        );
        if (!alumno) {
          throw new NotFoundException(
            `Alumno con id ${updateCartaPresentacionDto.idAlumno} no encontrado`,
          );
        }
      } catch (error) {
        throw new NotFoundException(
          `Alumno con id ${updateCartaPresentacionDto.idAlumno} no encontrado`,
        );
      }
    }

    // Validate secretaria if being updated
    if (updateCartaPresentacionDto.idSecretaria) {
      try {
        const secretaria = await firstValueFrom(
          this.coreClient.send(
            { cmd: 'find_one_secretaria' },
            updateCartaPresentacionDto.idSecretaria,
          ),
        );
        if (!secretaria) {
          throw new NotFoundException(
            `Secretaria con id ${updateCartaPresentacionDto.idSecretaria} no encontrada`,
          );
        }
      } catch (error) {
        throw new NotFoundException(
          `Secretaria con id ${updateCartaPresentacionDto.idSecretaria} no encontrada`,
        );
      }
    }

    // Validate empresa if being updated
    if (updateCartaPresentacionDto.idEmpresa) {
      const empresa = await this.prisma.empresa.findUnique({
        where: { id: updateCartaPresentacionDto.idEmpresa },
      });
      if (!empresa) {
        throw new BadRequestException(
          `Empresa con id ${updateCartaPresentacionDto.idEmpresa} no existe`,
        );
      }
    }

    // Validate documento if being updated
    if (updateCartaPresentacionDto.documentoId) {
      const documento = await this.prisma.documento.findUnique({
        where: { id: updateCartaPresentacionDto.documentoId },
      });
      if (!documento) {
        throw new BadRequestException(
          `Documento con id ${updateCartaPresentacionDto.documentoId} no existe`,
        );
      }
    }

    const dataToUpdate: any = { ...updateCartaPresentacionDto };
    if (updateCartaPresentacionDto.fechaInicio) {
      dataToUpdate.fechaInicio = new Date(updateCartaPresentacionDto.fechaInicio);
    }

    return await this.prisma.cartaPresentacion.update({
      where: { id },
      data: dataToUpdate,
      include: {
        empresa: true,
      },
    });
  }

  async submit(id: string) {
    const carta = await this.findOne(id);

    if (carta.estado !== CartaEstado.draft) {
      throw new BadRequestException(
        `La carta ya fue enviada. Estado actual: ${carta.estado}`,
      );
    }

    return await this.prisma.cartaPresentacion.update({
      where: { id },
      data: {
        estado: CartaEstado.submitted,
        submittedAt: new Date(),
      },
      include: {
        empresa: true,
      },
    });
  }

  async review(id: string) {
    const carta = await this.findOne(id);

    if (carta.estado !== CartaEstado.submitted) {
      throw new BadRequestException(
        `La carta debe estar en estado 'submitted' para revisarla. Estado actual: ${carta.estado}`,
      );
    }

    return await this.prisma.cartaPresentacion.update({
      where: { id },
      data: {
        estado: CartaEstado.reviewing,
      },
      include: {
        empresa: true,
      },
    });
  }

  async approve(id: string) {
    const carta = await this.findOne(id);

    if (carta.estado !== CartaEstado.reviewing) {
      throw new BadRequestException(
        `La carta debe estar en estado 'reviewing' para aprobarla. Estado actual: ${carta.estado}`,
      );
    }

    return await this.prisma.cartaPresentacion.update({
      where: { id },
      data: {
        estado: CartaEstado.approved,
        reviewedAt: new Date(),
      },
      include: {
        empresa: true,
      },
    });
  }

  async reject(id: string, motivoRechazo: string) {
    const carta = await this.findOne(id);

    if (carta.estado !== CartaEstado.reviewing) {
      throw new BadRequestException(
        `La carta debe estar en estado 'reviewing' para rechazarla. Estado actual: ${carta.estado}`,
      );
    }

    if (!motivoRechazo || motivoRechazo.trim() === '') {
      throw new BadRequestException('Debe proporcionar un motivo de rechazo');
    }

    return await this.prisma.cartaPresentacion.update({
      where: { id },
      data: {
        estado: CartaEstado.rejected,
        motivoRechazo,
        reviewedAt: new Date(),
      },
      include: {
        empresa: true,
      },
    });
  }

  async cancel(id: string) {
    const carta = await this.findOne(id);

    if (carta.estado === CartaEstado.approved) {
      throw new BadRequestException(
        'No se puede cancelar una carta que ya fue aprobada',
      );
    }

    return await this.prisma.cartaPresentacion.update({
      where: { id },
      data: {
        estado: CartaEstado.cancelled,
      },
      include: {
        empresa: true,
      },
    });
  }

  async remove(id: string) {
    const carta = await this.findOne(id);

    if (carta.estado !== CartaEstado.draft && carta.estado !== CartaEstado.cancelled) {
      throw new BadRequestException(
        `No se puede eliminar una carta en estado ${carta.estado}. Solo se pueden eliminar cartas en estado 'draft' o 'cancelled'`,
      );
    }

    return await this.prisma.cartaPresentacion.delete({
      where: { id },
    });
  }
}
