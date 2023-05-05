import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaidTransfersEventSync } from './entities/plaid-transfers-event-sync.entity';
import { PostponedPayment } from './entities/postponed-payment.entity';
import { PostponedPaymentInfo } from './entities/postponed-payment-info.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';
import { UserProvider } from '../user/user.provider';
import { ClientsModule } from 'src/shared/clients/clients.module';
import { PlaidModule } from '../plaid/plaid.module';
import { PaymentStatistic } from '../payment-statistics/entities/payment-statistic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlaidTransfersEventSync,
      PostponedPayment,
      PostponedPaymentInfo,
      Transaction,
      PaymentStatistic,
    ]),
    ClientsModule,
    PlaidModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, UserProvider],
})
export class TransactionsModule {}