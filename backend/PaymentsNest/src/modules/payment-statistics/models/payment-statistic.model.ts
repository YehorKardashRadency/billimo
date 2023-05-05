import { PaymentStatistic } from '../entities/payment-statistic.entity';

export interface IPaymentStatisticDTO {
  paid: number;
  forPayment: number;
}

export class PaymentStatisticDTO implements IPaymentStatisticDTO {
  paid: number;
  forPayment: number;

  constructor(paymentStatistic: PaymentStatistic) {
    this.paid = paymentStatistic.paid;
    this.forPayment = paymentStatistic.forPayment;
  }
}
