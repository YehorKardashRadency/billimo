import {
  ActionReducerMap,
  createFeatureSelector,
} from '@ngrx/store';
import {
  paymentStatisticFeatureKey,
  paymentStatisticReducer,
  PaymentStatisticState
} from "../resources/state/payment-statistic/payment-statistic.reducer";

export const billPaymentFeatureKey = 'billPayment';

export const selectBillPaymentState = createFeatureSelector<State>(
  billPaymentFeatureKey
);

export interface State {
  [paymentStatisticFeatureKey]: PaymentStatisticState;
}

export const reducers: ActionReducerMap<State> = {
  [paymentStatisticFeatureKey]: paymentStatisticReducer,
};
