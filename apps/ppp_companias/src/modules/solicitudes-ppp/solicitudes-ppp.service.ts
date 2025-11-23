import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PrismaCompaniasService } from '../../prisma/prisma.service';
import { CreateSolicitudPppDto } from './dto/create-solicitud-ppp.dto';
import { UpdateSolicitudPppDto } from './dto/update-solicitud-ppp.dto';
import { ESTADO_SOLICITUD } from '../../constants/estados.constants';

@Injectable()
export class SolicitudesPppService {
  private authServiceUrl: string;

  constructor(
    private prisma: PrismaCompaniasService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    const authHost = this.configService.get<string>('PPP_AUTH_HOST', 'localhost');
    const authPort = this.configService.get<string>('PPP_AUTH_PORT', '3001');
    this.authServiceUrl = authPort === '443' 
      ? `https://${authHost}` 
      : `http://${authHost}:${authPort}`;
  }

  async create(createDto: CreateSolicitudPppDto) {
    // Validar que el supervisor existe en ppp_auth
    try {
      await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/supervisores/${createDto.idSupervisor}`)
      );
    } catch (error) {
      throw new BadRequestException(`Supervisor con ID ${createDto.idSupervisor} no encontrado en el servicio de autenticación`);
    }

    // Validar que el alumno existe en ppp_auth
    try {
      await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/alumnos/${createDto.idAlumno}`)
      );
    } catch (error) {
      throw new BadRequestException(`Alumno con ID ${createDto.idAlumno} no encontrado en el servicio de autenticación`);
    }

    // Verificar que la empresa existe
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: createDto.idEmpresa },
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa con ID ${createDto.idEmpresa} no encontrada`);
    }

    try {
      return await this.prisma.solicitudPpp.create({
        data: {
          idSupervisor: createDto.idSupervisor,
          idAlumno: createDto.idAlumno,
          idEmpresa: createDto.idEmpresa,
          estado: createDto.estado ?? ESTADO_SOLICITUD.EN_PROCESO,
        },
        include: {
          empresa: true,
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
        empresa: true,
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
        empresa: true,
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
        empresa: true,
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
        empresa: true,
        reuniones: true,
        documentos: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEstado(estado: number) {
    return this.prisma.solicitudPpp.findMany({
      where: { estado },
      include: {
        empresa: true,
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
          ...(updateDto.estado !== undefined && { estado: updateDto.estado }),
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
    const estados = [
      { nombre: 'EN_PROCESO', valor: ESTADO_SOLICITUD.EN_PROCESO },
      { nombre: 'ASIGNADO', valor: ESTADO_SOLICITUD.ASIGNADO },
      { nombre: 'FINALIZADO', valor: ESTADO_SOLICITUD.FINALIZADO },
      { nombre: 'RECHAZADO', valor: ESTADO_SOLICITUD.RECHAZADO },
    ];
    const counts = await Promise.all(
      estados.map(async (estado) => ({
        estado: estado.nombre,
        valor: estado.valor,
        count: await this.prisma.solicitudPpp.count({ where: { estado: estado.valor } }),
      }))
    );
    return counts;
  }
}
