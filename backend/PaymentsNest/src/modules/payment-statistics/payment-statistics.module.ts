import { Module } from '@nestjs/common';
import { PaymentStatisticsController } from './payment-statistics.controller';
import { PaymentStatisticsService } from './payment-statistics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentStatistic } from './entities/payment-statistic.entity';
import { UserProvider } from '../user/user.provider';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentStatistic])],
  controllers: [PaymentStatisticsController],
  providers: [PaymentStatisticsService, UserProvider],
})
export class PaymentStatisticsModule {}
