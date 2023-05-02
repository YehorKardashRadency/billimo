import { createSelector, createFeatureSelector } from "@ngrx/store";
import * as fromCompanyAccount from "../reducers/company-account.reducer";

export const selectCompanyAccountEntity = createFeatureSelector<fromCompanyAccount.State>(
  fromCompanyAccount.companyAccountFeatureKey
);
export const companyAddressesSelector = createSelector(
  selectCompanyAccountEntity,
  fromCompanyAccount.addresses
);
export const defaultAddressSelector = createSelector(
  selectCompanyAccountEntity,
  fromCompanyAccount.defaultAddressId
);
