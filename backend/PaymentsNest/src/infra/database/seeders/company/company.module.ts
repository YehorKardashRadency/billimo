import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanySeederService } from './company.service';
import { PaymentStatistic } from 'src/modules/payment-statistics/entities/payment-statistic.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { Company } from 'src/shared/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Transaction, PaymentStatistic])],
  providers: [CompanySeederService],
  exports: [CompanySeederService],
})
export class CompanySeederModule {}
