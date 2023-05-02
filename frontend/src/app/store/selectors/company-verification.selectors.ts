import { createFeatureSelector } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
import * as fromCompanyVerification from './../reducers/company-verification.reducers';


export const companyVerificationFeatureSelector = createFeatureSelector<fromCompanyVerification.State>(
    fromCompanyVerification.companyVerificationFeatureKey
);

export const isVerificationRequestedSelector = createSelector(
    companyVerificationFeatureSelector,
    (state) => state.verifyCompany
)