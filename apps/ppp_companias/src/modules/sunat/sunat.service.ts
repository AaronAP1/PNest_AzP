import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface SunatRucResponse {
  razon_social: string;
  numero_documento: string;
  direccion: string;
}

@Injectable()
export class SunatService {
  private readonly apiUrl = 'https://api.decolecta.com/v1';
  private readonly apiToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiToken = this.configService.get<string>('SUNAT_API_TOKEN') || 'sk_11565.84mnn3NouKcJF0DL7B7RBOpHDkVtwSKO';
  }

  async consultarRuc(ruc: string): Promise<SunatRucResponse> {
    console.log(`[SunatService] Consultando RUC: ${ruc}`);
    console.log(`[SunatService] Token: ${this.apiToken ? 'Configurado' : 'NO CONFIGURADO'}`);
    
    try {
      // Validar formato de RUC (11 dígitos)
      if (!ruc || !/^\d{11}$/.test(ruc)) {
        throw new HttpException('RUC debe tener 11 dígitos', HttpStatus.BAD_REQUEST);
      }

      const url = `${this.apiUrl}/sunat/ruc/full`;
      console.log(`[SunatService] URL API: ${url}?numero=${ruc}`);
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: { numero: ruc },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiToken}`,
          },
        }),
      );

      const data = response.data;

      // Retornar solo los campos solicitados
      return {
        razon_social: data.razon_social,
        numero_documento: data.numero_documento,
        direccion: data.direccion,
      };
    } catch (error) {
      if (error.response?.status === 422) {
        throw new HttpException('RUC no válido o no encontrado', HttpStatus.NOT_FOUND);
      }
      
      if (error.response?.status === 401) {
        throw new HttpException('Token de API inválido', HttpStatus.UNAUTHORIZED);
      }

      throw new HttpException(
        error.response?.data?.message || 'Error al consultar SUNAT',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
