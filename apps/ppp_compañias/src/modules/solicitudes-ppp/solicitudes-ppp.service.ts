import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaCompaniasService } from '../../prisma/prisma.service';
import { CreateSolicitudPppDto, EstadoSolicitud } from './dto/create-solicitud-ppp.dto';
import { UpdateSolicitudPppDto } from './dto/update-solicitud-ppp.dto';

@Injectable()
export class SolicitudesPppService {
  constructor(private prisma: PrismaCompaniasService) {}

  async create(createDto: CreateSolicitudPppDto) {
    try {
      return await this.prisma.solicitudPpp.create({
        data: {
          idSupervisor: createDto.idSupervisor,
          idAlumno: createDto.idAlumno,
          estado: createDto.estado || ('pendiente' as any),
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe una solicitud con estos datos');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.solicitudPpp.findMany({
      include: {
        cartaPresentacion: true,
        reuniones: true,
        documentos: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const solicitud = await this.prisma.solicitudPpp.findUnique({
      where: { id },
      include: {
        cartaPresentacion: true,
        reuniones: true,
        documentos: true,
      },
    });

    if (!solicitud) {
      throw new NotFoundException(`Solicitud PPP con ID ${id} no encontrada`);
    }

    return solicitud;
  }

  async findByAlumno(idAlumno: string) {
    return this.prisma.solicitudPpp.findMany({
      where: { idAlumno },
      include: {
        cartaPresentacion: true,
        reuniones: true,
        documentos: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySupervisor(idSupervisor: string) {
    return this.prisma.solicitudPpp.findMany({
      where: { idSupervisor },
      include: {
        cartaPresentacion: true,
        reuniones: true,
        documentos: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEstado(estado: string) {
    return this.prisma.solicitudPpp.findMany({
      where: { estado: estado as any },
      include: {
        cartaPresentacion: true,
        reuniones: true,
        documentos: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateDto: UpdateSolicitudPppDto) {
    await this.findOne(id); // Verifica que existe

    try {
      return await this.prisma.solicitudPpp.update({
        where: { id },
        data: {
          ...(updateDto.idSupervisor && { idSupervisor: updateDto.idSupervisor }),
          ...(updateDto.idAlumno && { idAlumno: updateDto.idAlumno }),
          ...(updateDto.estado && { estado: updateDto.estado as any }),
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe una solicitud con estos datos');
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id); // Verifica que existe

    return this.prisma.solicitudPpp.delete({
      where: { id },
    });
  }

  async countByEstado() {
    const estados = ['pendiente', 'en_proceso', 'aprobado', 'rechazado', 'cancelado'];
    const counts = await Promise.all(
      estados.map(async (estado) => ({
        estado,
        count: await this.prisma.solicitudPpp.count({ where: { estado: estado as any } }),
      }))
    );
    return counts;
  }
}
