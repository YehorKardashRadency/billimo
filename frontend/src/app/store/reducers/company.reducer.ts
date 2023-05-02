import { act } from '@ngrx/effects';
import { createReducer, on } from '@ngrx/store';
import { CompanyModel } from 'src/app/shared/models/CompanyModel';
import * as fromCompanyActions from '../actions/company.actions';
import * as fromCompanyVerificationActions from '../actions/company-verification.actions'
export const companyFeatureKey = 'company';

export interface State {
  company: CompanyModel | null;
  companies: CompanyModel[] | null;
  error: any;
  isVerified:boolean,
}

export const initialState: State = {
  company: null,
  companies: null,
  error: null,
  isVerified:false,
};

export const reducer = createReducer(
  initialState,

  on(fromCompanyActions.loadCompaniesSuccess, (state, action) => {
    return {
      ...state,
      companies: action.companies,
      error: null,
      
    };
  }),
  on(fromCompanyActions.loadCompaniesFailure, (state, action) => {
    return {
      ...state,
      companies: null,
      error: action.error
    };
  }),

  on(fromCompanyActions.loadCompanySuccess, (state, action) => {
    return {
      ...state,
      company: action.company,
      error: null,
      isVerified:action.company.isVerified,
    };
  }),
  on(fromCompanyActions.loadCompanyFailure, (state, action) => {
    return {
      ...state,
      company: null,
      error: action.error
    };
  }),
  on(fromCompanyVerificationActions.verifyCompanySuccess, (state,action) => {
    
    const verifiedCompany:CompanyModel = {
      ...state.company!,
      isVerified:true,
    }
    return {
      ...state,
      company:verifiedCompany,
      isVerified:true,
    }
  })
);
