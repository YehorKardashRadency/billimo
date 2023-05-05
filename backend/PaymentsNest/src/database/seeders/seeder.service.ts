import { Injectable } from '@nestjs/common';
import { CompanySeederService } from './company/company.service';
import { TransactionSeederService } from './transaction/transaction.service';
import { PaymentStatisticSeederService } from './payment-statistic/payment-statistic.service';

@Injectable()
export class SeederService {
  constructor(
    private readonly companySeederService: CompanySeederService,
    private readonly transactionSeederService: TransactionSeederService,
    private readonly paymentStatisticSeederService: PaymentStatisticSeederService
  ) {}
  async seed() {
    await this.companySeederService.create();
    // await this.transactionSeederService.create();
    await this.paymentStatisticSeederService.create();
  }
}
