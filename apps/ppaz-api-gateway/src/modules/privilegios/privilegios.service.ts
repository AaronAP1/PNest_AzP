import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreatePrivilegioDto, UpdatePrivilegioDto } from './dto';

@Injectable()
export class PrivilegiosService {
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3002';
  }

  async create(createPrivilegioDto: CreatePrivilegioDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/privilegios`, createPrivilegioDto)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al crear privilegio',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/privilegios`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al obtener privilegios',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/privilegios/${id}`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al obtener privilegio',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updatePrivilegioDto: UpdatePrivilegioDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(`${this.authServiceUrl}/privilegios/${id}`, updatePrivilegioDto)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al actualizar privilegio',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.authServiceUrl}/privilegios/${id}`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al eliminar privilegio',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
