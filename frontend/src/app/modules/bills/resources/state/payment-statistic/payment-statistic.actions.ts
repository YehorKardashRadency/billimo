import {createAction, props} from '@ngrx/store';
import {PaymentStatistic} from "../../models/payment-statistic.models";


export const loadPaymentStatisticsSuccess = createAction(
  '[PaymentStatistic] Load PaymentStatistics Success',
  props<{ paymentStatistic: PaymentStatistic }>()
);

export const changeTabProperties = createAction(
  '[PaymentStatistic] Change Tab Properties',
  props<{ currentTab?: string }>()
)
