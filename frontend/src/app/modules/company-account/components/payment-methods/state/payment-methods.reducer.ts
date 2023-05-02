import {createReducer, on} from '@ngrx/store';
import {PaymentMethodModel, PaymentMethodType} from "../resources/models/payment-method-model";
import * as PaymentMethodsActions from './payment-methods.actions';
import {PublicLinkTokenModel} from "../../../../../core/resources/models/public-link-token.model";

export const paymentMethodsKey = 'paymentMethods';

export interface State {
  paymentMethods: PaymentMethodModel[] | null;
  error: any;

  plaidError: any;
}

export const initialState: State = {
  paymentMethods: null,
  error: null,

  plaidError: {},
};

export const reducer = createReducer(
  initialState,

  on(PaymentMethodsActions.loadPaymentMethods, (state, action) => ({
      ...state,
      error: null,
    })
  ),

  on(PaymentMethodsActions.loadPaymentMethodsSuccess, (state, action) => ({
      ...state,
      paymentMethods: action.result,
      error: null,
    })
  ),

  on(PaymentMethodsActions.loadPaymentMethodsFailure, (state, action) => ({
      ...state,
      error: action.error,
    })
  ),

  on(PaymentMethodsActions.createLinkTokenFailure, (state, action) => ({
    ...state,
    plaidError: action.error,
  })),

  on(PaymentMethodsActions.exchangeLinkTokenFailure, (state, action) => ({
    ...state,
    plaidError: action.error,
  })),
);
