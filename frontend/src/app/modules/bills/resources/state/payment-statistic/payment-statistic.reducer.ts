import {createReducer, on} from '@ngrx/store';
import * as PaymentStatisticActions from './payment-statistic.actions';
import {BillPaymentTabProperty} from "../../models/bill-payment-tab-property";

import {PaymentStatistic, TabType} from "../../models/payment-statistic.models";
import {receiveBillPath, sendBillPath} from "../../../bills-routing.module";

export const paymentStatisticFeatureKey = 'paymentStatistic';

export interface PaymentStatisticState {
  currentTabProperty: BillPaymentTabProperty;
  paymentStatistic: PaymentStatistic;
}

const tabProperties: { [key: string]: BillPaymentTabProperty } = {
  [sendBillPath]: {
    img: 'assets/images/icons/AmountOfBillsSent.svg',
    type: TabType.SEND_BILL
  },
  [receiveBillPath]: {
    img: 'assets/images/icons/AmountOfBillsReceived.svg',
    type: TabType.RECEIVE_BILL
  }
};

export const initialState: PaymentStatisticState = {
  currentTabProperty: tabProperties[sendBillPath],
  paymentStatistic: {
    forPayment: 0,
    paid: 0,
  }
};

export const paymentStatisticReducer = createReducer(
  initialState,
  on(PaymentStatisticActions.changeTabProperties, (state, action) => ({
    ...state,
    currentTabProperty: tabProperties[action.currentTab!],
  })),
  on(PaymentStatisticActions.loadPaymentStatisticsSuccess, (state, action) => ({
    ...state,
    paymentStatistic: action.paymentStatistic,
  }))
);
