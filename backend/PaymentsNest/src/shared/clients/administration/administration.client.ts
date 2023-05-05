import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiService } from '../api.service';
import { HttpService } from '@nestjs/axios';
import { UserPlaidData } from './get-plaid-data.model';

@Injectable()
export class AdministrationClient extends ApiService {
  constructor(
    protected readonly http: HttpService,
    private readonly configService: ConfigService
  ) {
    super(http);
    this.baseUrl = configService.getOrThrow('ADMINISTRATION_API');
  }
  async getPlaidData(companyId: number, paymentMethodId?: number) {
    const query = paymentMethodId ? `?PaymentMethodId=${paymentMethodId}` : '';
    const response = await this.get<UserPlaidData>(
      `/api/Company/${companyId}/get-plaid-data/${query}`
    );
    return response.data as UserPlaidData;
  }
}
