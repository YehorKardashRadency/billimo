import {
  BadRequestException,
  Controller,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TabType } from './entities/tab-type.enum';
import { PaymentStatisticsService } from './payment-statistics.service';

@Controller('BillPayment')
export class PaymentStatisticsController {
  constructor(
    private readonly paymentStatisticsService: PaymentStatisticsService
  ) {}
  @Get('payment-statistic')
  async getPaymentStatistics(
    @Query('tabType', ParseIntPipe) tabTypeQuery: number
  ) {
    const tabType = tabTypeQuery as TabType;
    if (tabType === undefined) {
      throw new BadRequestException();
    }
    const result = this.paymentStatisticsService.getPaymentStatistics(tabType);
    return await result;
  }
}
