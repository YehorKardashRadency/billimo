import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paymentStatistics } from './payment_statistics';
import { PaymentStatistic } from 'src/modules/payment-statistics/entities/payment-statistic.entity';

@Injectable()
export class PaymentStatisticSeederService {
  constructor(
    @InjectRepository(PaymentStatistic)
    private readonly transactionRepository: Repository<PaymentStatistic>,
  ) {}
  async create() {
    const count = await this.transactionRepository.count();
    console.log(`Found ${count} transactions`);
    if (count == 0) {
      await this.transactionRepository.save(paymentStatistics);
    } else {
      console.log('Skipping');
    }
  }
}
