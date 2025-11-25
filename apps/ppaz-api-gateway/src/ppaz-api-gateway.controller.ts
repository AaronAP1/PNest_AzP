import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { PpazApiGatewayService } from './ppaz-api-gateway.service';

@Controller()
export class PpazApiGatewayController {
  constructor(
    private readonly ppazApiGatewayService: PpazApiGatewayService,
    @Inject('PPP_CORE_SERVICE') private readonly coreClient: ClientProxy,
    @Inject('PPP_COMPANIAS_SERVICE') private readonly companiasClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.ppazApiGatewayService.getHello();
  }

  // Endpoints para ppp_core
  @Get('core/hello')
  getCoreHello(): Observable<string> {
    return this.coreClient.send({ cmd: 'get_hello_core' }, {});
  }

  @Get('core/data')
  getCoreData(): Observable<any> {
    return this.coreClient.send({ cmd: 'get_core_data' }, { info: 'Solicitud desde Gateway' });
  }

  // Endpoints para ppp_companias
  @Get('companies/hello')
  getCompaniasHello(): Observable<string> {
    return this.companiasClient.send({ cmd: 'get_hello_companias' }, {});
  }

  @Get('companies')
  getAllCompanies(): Observable<any> {
    return this.companiasClient.send({ cmd: 'get_all_companies' }, {});
  }

  @Get('companies/:id')
  getCompanyById(@Param('id') id: string): Observable<any> {
    return this.companiasClient.send({ cmd: 'get_company_by_id' }, parseInt(id));
  }
}
