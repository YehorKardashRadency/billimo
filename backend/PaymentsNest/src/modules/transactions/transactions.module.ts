import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostponedPayment } from './entities/postponed-payment.entity';
import { PostponedPaymentInfo } from './entities/postponed-payment-info.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';
import { UserProvider } from '../user/user.provider';
import { ApiClientsModule } from 'src/shared/clients/clients.module';
import { PlaidModule } from '../plaid/plaid.module';
import { PaymentStatistic } from '../payment-statistics/entities/payment-statistic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostponedPayment,
      PostponedPaymentInfo,
      Transaction,
      PaymentStatistic,
    ]),
    ApiClientsModule,
    PlaidModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, UserProvider],
})
export class TransactionsModule {}
