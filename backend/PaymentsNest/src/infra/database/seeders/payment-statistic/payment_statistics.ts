import { PaymentStatistic } from 'src/modules/payment-statistics/entities/payment-statistic.entity';
import { TabType } from 'src/modules/payment-statistics/entities/tab-type.enum';

export const paymentStatistics: PaymentStatistic[] = [
  new PaymentStatistic(1, TabType.Send, 3000, 2000),
  new PaymentStatistic(1, TabType.Receive, 1000, 2000),
  new PaymentStatistic(2, TabType.Send, 4000, 1000),
  new PaymentStatistic(2, TabType.Receive, 4000, 2000),
  new PaymentStatistic(3, TabType.Send, 2000, 2000),
  new PaymentStatistic(3, TabType.Receive, 1000, 2000),
];
