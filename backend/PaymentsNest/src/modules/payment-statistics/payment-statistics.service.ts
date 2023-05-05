import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaymentStatistic } from './entities/payment-statistic.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TabType } from './entities/tab-type.enum';
import { CurrentUser } from '../user/user.model';
import { PaymentStatisticDTO } from './models/payment-statistic.model';
import { USER } from '../user/user.provider';

@Injectable()
export class PaymentStatisticsService {
  constructor(
    @InjectRepository(PaymentStatistic)
    private readonly paymentStatisticRepository: Repository<PaymentStatistic>,
    @Inject(USER)
    private readonly user: () => CurrentUser
  ) {}

  async getPaymentStatistics(tabType: TabType) {
    const companyId = this.user().companyId;
    const paymentStatistic = await this.paymentStatisticRepository.findOne({
      where: {
        companyId: companyId,
        tabType: tabType,
      },
    });
    return new PaymentStatisticDTO(paymentStatistic);
  }
}
