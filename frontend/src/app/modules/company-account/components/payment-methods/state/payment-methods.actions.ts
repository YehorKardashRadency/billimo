import {createAction, props} from "@ngrx/store";
import {PaymentMethodModel} from "../resources/models/payment-method-model";

export const loadPaymentMethods = createAction(
  '[Payment Methods Component] Load Payment Methods'
);

export const loadPaymentMethodsSuccess = createAction(
  '[Payment Methods Effects] Load Payment Methods Success',
  props<{ result: PaymentMethodModel[] | null }>()
);

export const loadPaymentMethodsFailure = createAction(
  '[Payment Methods Effects] Load Payment Methods Failure',
  props<{ error: any }>()
);

export const createLinkToken = createAction(
  '[Payment Methods Component] Create Link Token'
)

export const createLinkTokenFailure = createAction(
  '[Plaid Effects] Create Link Token Failure',
  props<{ error: any }>()
)

export const exchangeLinkToken = createAction(
  '[Payment Methods Service] Exchange Link Token',
  props<{ publicToken: string }>(),
)

export const exchangeLinkTokenSuccess = createAction(
  '[Payment Methods Effects] Exchange Link Token Success',
)

export const exchangeLinkTokenFailure = createAction(
  '[Payment Methods Effects] Exchange Link Token Failure',
  props<{ error: any }>(),
)
