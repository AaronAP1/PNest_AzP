import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateCartaPresentacionDto, UpdateCartaPresentacionDto } from './dto';
import { PrismaCompaniasService } from '../../prisma/prisma.service';
import { ESTADO_CARTA } from '../../constants/estados.constants';

@Injectable()
export class CartasPresentacionService {
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

  async create(createCartaPresentacionDto: CreateCartaPresentacionDto) {
    // Validar que el alumno existe en ppp_auth
    try {
      await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/alumnos/${createCartaPresentacionDto.idAlumno}`)
      );
    } catch (error) {
      throw new BadRequestException(`Alumno con ID ${createCartaPresentacionDto.idAlumno} no encontrado en el servicio de autenticación`);
    }

    // Validar que la secretaria existe en ppp_auth (si se proporcionó)
    if (createCartaPresentacionDto.idSecretaria) {
      try {
        await firstValueFrom(
          this.httpService.get(`${this.authServiceUrl}/secretarias/${createCartaPresentacionDto.idSecretaria}`)
        );
      } catch (error) {
        throw new BadRequestException(`Secretaria con ID ${createCartaPresentacionDto.idSecretaria} no encontrada en el servicio de autenticación`);
      }
    }

    // Verificar que la empresa existe
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: createCartaPresentacionDto.idEmpresa },
    });

    if (!empresa) {
      throw new NotFoundException(
        `Empresa con ID ${createCartaPresentacionDto.idEmpresa} no encontrada`,
      );
    }

    return await this.prisma.cartaPresentacion.create({
      data: {
        idAlumno: createCartaPresentacionDto.idAlumno,
        idEmpresa: createCartaPresentacionDto.idEmpresa,
        idSecretaria: createCartaPresentacionDto.idSecretaria,
        areaPractica: createCartaPresentacionDto.areaPractica,
        fechaInicio: new Date(createCartaPresentacionDto.fechaInicio),
        motivoRechazo: createCartaPresentacionDto.motivoRechazo,
        estado: createCartaPresentacionDto.estado ?? ESTADO_CARTA.PENDIENTE,
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
      orderBy: { createdAt: 'desc' },
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

  async findByAlumno(idAlumno: string) {
    return await this.prisma.cartaPresentacion.findMany({
      where: { idAlumno },
      include: {
        empresa: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEmpresa(idEmpresa: string) {
    return await this.prisma.cartaPresentacion.findMany({
      where: { idEmpresa },
      include: {
        empresa: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySecretaria(idSecretaria: string) {
    return await this.prisma.cartaPresentacion.findMany({
      where: { idSecretaria },
      include: {
        empresa: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEstado(estado: number) {
    return await this.prisma.cartaPresentacion.findMany({
      where: { estado },
      include: {
        empresa: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateCartaPresentacionDto: UpdateCartaPresentacionDto) {
    await this.findOne(id);

    const dataToUpdate: any = {};

    if (updateCartaPresentacionDto.idAlumno) {
      dataToUpdate.idAlumno = updateCartaPresentacionDto.idAlumno;
    }

    if (updateCartaPresentacionDto.idEmpresa) {
      dataToUpdate.idEmpresa = updateCartaPresentacionDto.idEmpresa;
    }

    if (updateCartaPresentacionDto.idSecretaria !== undefined) {
      dataToUpdate.idSecretaria = updateCartaPresentacionDto.idSecretaria;
    }

    if (updateCartaPresentacionDto.areaPractica !== undefined) {
      dataToUpdate.areaPractica = updateCartaPresentacionDto.areaPractica;
    }

    if (updateCartaPresentacionDto.fechaInicio) {
      dataToUpdate.fechaInicio = new Date(updateCartaPresentacionDto.fechaInicio);
    }

    if (updateCartaPresentacionDto.motivoRechazo !== undefined) {
      dataToUpdate.motivoRechazo = updateCartaPresentacionDto.motivoRechazo;
    }

    if (updateCartaPresentacionDto.estado !== undefined) {
      dataToUpdate.estado = updateCartaPresentacionDto.estado;
    }

    return await this.prisma.cartaPresentacion.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.prisma.cartaPresentacion.delete({
      where: { id },
    });
  }

  // Alias para compatibilidad - findByUsuario apunta a findByAlumno
  async findByUsuario(idAlumno: string) {
    return this.findByAlumno(idAlumno);
  }

  // Transiciones de estado
  async submit(id: string) {
    const carta = await this.findOne(id);
    
    if (carta.estado !== ESTADO_CARTA.PENDIENTE) {
      throw new BadRequestException('Solo se pueden enviar cartas en estado PENDIENTE');
    }

    return await this.prisma.cartaPresentacion.update({
      where: { id },
      data: { estado: ESTADO_CARTA.EN_PROCESO },
    });
  }

  async review(id: string) {
    const carta = await this.findOne(id);
    
    if (carta.estado !== ESTADO_CARTA.EN_PROCESO) {
      throw new BadRequestException('Solo se pueden revisar cartas en proceso');
    }

    return await this.prisma.cartaPresentacion.update({
      where: { id },
      data: { estado: ESTADO_CARTA.ENTREGADO },
    });
  }

  async approve(id: string) {
    const carta = await this.findOne(id);
    
    if (carta.estado !== ESTADO_CARTA.EN_PROCESO) {
      throw new BadRequestException('Solo se pueden aprobar cartas en proceso');
    }

    return await this.prisma.cartaPresentacion.update({
      where: { id },
      data: { estado: ESTADO_CARTA.ENTREGADO },
    });
  }

  async reject(id: string, motivoRechazo: string) {
    const carta = await this.findOne(id);
    
    if (carta.estado !== ESTADO_CARTA.EN_PROCESO) {
      throw new BadRequestException('Solo se pueden rechazar cartas en proceso');
    }

    if (!motivoRechazo) {
      throw new BadRequestException('El motivo de rechazo es obligatorio');
    }

    return await this.prisma.cartaPresentacion.update({
      where: { id },
      data: { 
        estado: ESTADO_CARTA.RECHAZADO,
        motivoRechazo,
      },
    });
  }

  async cancel(id: string) {
    const carta = await this.findOne(id);
    
    if (carta.estado === ESTADO_CARTA.ENTREGADO) {
      throw new BadRequestException('No se pueden cancelar cartas entregadas');
    }

    return await this.prisma.cartaPresentacion.update({
      where: { id },
      data: { estado: ESTADO_CARTA.RECHAZADO },
    });
  }
}
