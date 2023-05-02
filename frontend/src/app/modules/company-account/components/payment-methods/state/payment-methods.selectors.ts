import { createSelector } from "@ngrx/store";
import { selectCompanyAccountState } from "../../../state/company-account.selector";

export const selectPaymentMethodsState = createSelector(
  selectCompanyAccountState,
  state => state.paymentMethods
);

export const selectPaymentMethods = createSelector(
  selectPaymentMethodsState,
  state => state.paymentMethods
);

export const selectPaymentMethodsCount = createSelector(
  selectPaymentMethods,
  state => state?.length ?? 0
);
