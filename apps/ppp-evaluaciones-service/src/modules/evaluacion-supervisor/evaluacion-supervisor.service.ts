import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEvaluacionSupervisorDto } from './dto/create-evaluacion-supervisor.dto';
import { UpdateEvaluacionSupervisorDto } from './dto/update-evaluacion-supervisor.dto';

@Injectable()
export class EvaluacionSupervisorService {
  private authServiceUrl: string;

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    const authHost = this.configService.get<string>('PPP_AUTH_HOST', 'localhost');
    const authPort = this.configService.get<string>('PPP_AUTH_PORT', '3001');
    this.authServiceUrl = authPort === '443' 
      ? `https://${authHost}` 
      : `http://${authHost}:${authPort}`;
  }

  async create(createDto: CreateEvaluacionSupervisorDto) {
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

    return this.prisma.evaluacionSupervisor.create({
      data: {
        idSupervisor: createDto.idSupervisor,
        idAlumno: createDto.idAlumno,
        comentario: createDto.comentario,
        estado: createDto.estado ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.evaluacionSupervisor.findMany({
      include: {
        preguntas: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const evaluacion = await this.prisma.evaluacionSupervisor.findUnique({
      where: { id },
      include: {
        preguntas: {
          include: {
            pregunta: true,
          },
        },
      },
    });

    if (!evaluacion) {
      throw new NotFoundException(`Evaluación Supervisor con ID ${id} no encontrada`);
    }

    return evaluacion;
  }

  async findBySupervisor(idSupervisor: string) {
    return this.prisma.evaluacionSupervisor.findMany({
      where: { idSupervisor },
      include: {
        preguntas: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByAlumno(idAlumno: string) {
    return this.prisma.evaluacionSupervisor.findMany({
      where: { idAlumno },
      include: {
        preguntas: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateDto: UpdateEvaluacionSupervisorDto) {
    await this.findOne(id);

    return this.prisma.evaluacionSupervisor.update({
      where: { id },
      data: {
        ...(updateDto.idSupervisor && { idSupervisor: updateDto.idSupervisor }),
        ...(updateDto.idAlumno && { idAlumno: updateDto.idAlumno }),
        ...(updateDto.comentario !== undefined && { comentario: updateDto.comentario }),
        ...(updateDto.estado !== undefined && { estado: updateDto.estado }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.evaluacionSupervisor.delete({
      where: { id },
    });
  }
}
