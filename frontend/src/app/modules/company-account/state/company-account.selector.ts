import {createFeatureSelector} from "@ngrx/store";
import * as AccountCompanyReducer from "./company-account.reducer";

export const selectCompanyAccountState = createFeatureSelector<AccountCompanyReducer.State>(
  AccountCompanyReducer.companyAccountFeatureKey,
);
