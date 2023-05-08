import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentStatisticSeederService } from './payment-statistic.service';
import { PaymentStatistic } from 'src/modules/payment-statistics/entities/payment-statistic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentStatistic])],
  providers: [PaymentStatisticSeederService],
  exports: [PaymentStatisticSeederService],
})
export class PaymentStatisticSeederModule {}
