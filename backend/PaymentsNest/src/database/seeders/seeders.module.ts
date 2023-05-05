import { Module } from '@nestjs/common';
import { CompanySeederModule } from './company/company.module';
import { SeederService } from './seeder.service';
import { TransactionSeederModule } from './transaction/transaction.module';
import { PaymentStatisticSeederModule } from './payment-statistic/payment-statistic.module';

@Module({
  imports: [
    CompanySeederModule,
    TransactionSeederModule,
    PaymentStatisticSeederModule,
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeedersModule {}
