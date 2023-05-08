import { Module } from '@nestjs/common';
import { ConsumersController } from './consumers.controller';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { Exchanges } from 'src/infra/rabbitmq/exchanges';
import { ConsumersService } from './consumers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentStatistic } from '../payment-statistics/entities/payment-statistic.entity';
import { Company } from 'src/shared/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentStatistic, Company]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('QUEUE_URL'),
        exchanges: [
          {
            name: Exchanges.UpdatePaymentStatistic,
            type: 'fanout',
          },
          {
            name: Exchanges.UpdateBuyerStatistic,
            type: 'fanout',
          },
          {
            name: Exchanges.CreatePaymentStatistic,
            type: 'fanout',
          },
        ],
        enableControllerDiscovery: true,
      }),
    }),
    ConsumersModule,
  ],
  controllers: [ConsumersController],
  providers: [ConsumersService],
})
export class ConsumersModule {}
