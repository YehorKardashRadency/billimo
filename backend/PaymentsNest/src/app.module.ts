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
import { SeedersModule } from './infra/database/seeders/seeders.module';
import { UserProvider } from './modules/user/user.provider';
import { Company } from './shared/entities/company.entity';
import { ApiClientsModule } from './shared/clients/clients.module';
import { PlaidModule } from './modules/plaid/plaid.module';
import { PostponedPaymentInfo } from './modules/transactions/entities/postponed-payment-info.entity';
import { PostponedPayment } from './modules/transactions/entities/postponed-payment.entity';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { PlaidTransfersEventSync } from './modules/webhooks/entities/plaid-transfers-event-sync.entity';
import { ConsumersModule } from './modules/consumers/consumers.module';

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
          PlaidTransfersEventSync,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    PaymentStatisticsModule,
    TransactionsModule,
    SeedersModule,
    ApiClientsModule,
    PlaidModule,
    WebhooksModule,
    ConsumersModule,
  ],
  controllers: [],
  providers: [
    AppService,
    UserProvider,
    // {
    //   provide: QueueServices.UpdatePaymentStatisticService,
    //   useFactory: (configService: ConfigService) => {
    //     return ClientProxyFactory.create(
    //       getQueueOptions(
    //         configService.getOrThrow('QUEUE_URL'),
    //         Queues.UpdatePaymentStatistic
    //       )
    //     );
    //   },
    //   inject: [ConfigService],
    // },
    // {
    //   provide: QueueServices.CreatePaymentStatisticService,
    //   useFactory: (configService: ConfigService) => {
    //     return ClientProxyFactory.create(
    //       getQueueOptions(
    //         configService.getOrThrow('QUEUE_URL'),
    //         Queues.CreatePaymentStatistic
    //       )
    //     );
    //   },
    //   inject: [ConfigService],
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).exclude('webhooks/(.*)').forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
