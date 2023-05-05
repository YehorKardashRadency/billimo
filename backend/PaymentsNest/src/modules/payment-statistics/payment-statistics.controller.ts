import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { PaymentStatisticsService } from './payment-statistics.service';
import { TabType } from './entities/tab-type.enum';

@Controller('BillPayment')
export class PaymentStatisticsController {
  constructor(
    private readonly paymentStatisticsService: PaymentStatisticsService,
  ) {}
  @Get('payment-statistic')
  async getPaymentStatistics(@Query('tabType') tabTypeQuery: string) {
    const tabType = TabType[tabTypeQuery];
    if (tabType === undefined) {
      throw new BadRequestException();
    }
    const result = this.paymentStatisticsService.getPaymentStatistics(
      TabType[tabTypeQuery],
    );
    return await result;
  }
}
