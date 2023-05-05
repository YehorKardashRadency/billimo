import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserMiddleware } from './modules/user/user.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentStatisticsModule } from './modules/payment-statistics/payment-statistics.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { Transaction } from './modules/transactions/entities/transaction.entity';
import { PaymentStatistic } from './modules/payment-statistics/entities/payment-statistic.entity';
import { PlaidTransfer } from './modules/plaid/entities/plaid-transfer.entity';
import { SeedersModule } from './database/seeders/seeders.module';
import { UserProvider } from './modules/user/user.provider';
import { Company } from './shared/entities/company.entity';
import { ClientsModule } from './shared/clients/clients.module';
import { PlaidModule } from './modules/plaid/plaid.module';
import { PostponedPaymentInfo } from './modules/transactions/entities/postponed-payment-info.entity';
import { PostponedPayment } from './modules/transactions/entities/postponed-payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entitySkipConstructor: true,
        entities: [
          Company,
          Transaction,
          PaymentStatistic,
          PlaidTransfer,
          PostponedPaymentInfo,
          PostponedPayment,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    PaymentStatisticsModule,
    TransactionsModule,
    SeedersModule,
    ClientsModule,
    PlaidModule,
  ],
  controllers: [],
  providers: [AppService, UserProvider],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
