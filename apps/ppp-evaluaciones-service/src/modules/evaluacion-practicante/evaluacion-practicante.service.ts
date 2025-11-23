import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEvaluacionPracticanteDto } from './dto/create-evaluacion-practicante.dto';
import { UpdateEvaluacionPracticanteDto } from './dto/update-evaluacion-practicante.dto';
import { ESTADO_EVALUACION_PRACTICANTE } from '../../constants/estados.constants';

@Injectable()
export class EvaluacionPracticanteService {
  private companiasServiceUrl: string;

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    const companiasHost = this.configService.get<string>('PPP_COMPANIAS_HOST', 'localhost');
    const companiasPort = this.configService.get<string>('PPP_COMPANIAS_PORT', '3003');
    this.companiasServiceUrl = companiasPort === '443' 
      ? `https://${companiasHost}` 
      : `http://${companiasHost}:${companiasPort}`;
  }

  async create(createDto: CreateEvaluacionPracticanteDto) {
    // Validar que la solicitud PPP existe en ppp_companias
    try {
      await firstValueFrom(
        this.httpService.get(`${this.companiasServiceUrl}/solicitudes-ppp/${createDto.idSolicitud}`)
      );
    } catch (error) {
      throw new BadRequestException(`Solicitud PPP con ID ${createDto.idSolicitud} no encontrada en el servicio de compañías`);
    }

    return this.prisma.evaluacionPracticante.create({
      data: {
        idSolicitud: createDto.idSolicitud,
        comentario: createDto.comentario,
        estado: createDto.estado ?? ESTADO_EVALUACION_PRACTICANTE.PENDIENTE,
      },
    });
  }

  async findAll() {
    return this.prisma.evaluacionPracticante.findMany({
      include: {
        preguntasLinea: true,
        evaluacionPracticanteSolicitud: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const evaluacion = await this.prisma.evaluacionPracticante.findUnique({
      where: { id },
      include: {
        preguntasLinea: true,
        evaluacionPracticanteSolicitud: {
          include: {
            dimensionTransversal: true,
          },
        },
      },
    });

    if (!evaluacion) {
      throw new NotFoundException(`Evaluación Practicante con ID ${id} no encontrada`);
    }

    return evaluacion;
  }

  async findBySolicitud(idSolicitud: string) {
    return this.prisma.evaluacionPracticante.findMany({
      where: { idSolicitud },
      include: {
        preguntasLinea: true,
        evaluacionPracticanteSolicitud: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateDto: UpdateEvaluacionPracticanteDto) {
    await this.findOne(id);

    return this.prisma.evaluacionPracticante.update({
      where: { id },
      data: {
        ...(updateDto.idSolicitud && { idSolicitud: updateDto.idSolicitud }),
        ...(updateDto.comentario !== undefined && { comentario: updateDto.comentario }),
        ...(updateDto.estado !== undefined && { estado: updateDto.estado }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.evaluacionPracticante.delete({
      where: { id },
    });
  }
}
