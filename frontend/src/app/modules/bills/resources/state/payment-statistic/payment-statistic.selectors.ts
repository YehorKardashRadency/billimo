import {createSelector} from '@ngrx/store';
import {selectBillPaymentState} from "../../../reducers";
import {paymentStatisticFeatureKey} from "./payment-statistic.reducer";


export const selectPaymentStatisticState = createSelector(
  selectBillPaymentState,
  (state) => state[paymentStatisticFeatureKey]
);

export const selectCurrentTabProperty = createSelector(
  selectPaymentStatisticState,
  (state) => state.currentTabProperty
)

export const selectPaymentStatistic = createSelector(
  selectPaymentStatisticState,
  (state) => state.paymentStatistic
)
