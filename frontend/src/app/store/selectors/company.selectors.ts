import { CompanyModel } from 'src/app/shared/models/CompanyModel';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCompany from '../reducers/company.reducer';

export const selectCompanyState = createFeatureSelector<fromCompany.State>(
  fromCompany.companyFeatureKey
);

export const selectAllCompanies = createSelector(
  selectCompanyState,
  (state: fromCompany.State): any => state.companies
);

export const selectCompany = createSelector(
  selectCompanyState,
  (state: fromCompany.State) => state.company
);

export const selectIsVerified = createSelector(
  selectCompanyState,
  (state:fromCompany.State) => state?.isVerified
)
