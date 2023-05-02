import { createReducer, on } from '@ngrx/store';
import * as fromCompanyVerification from '../actions/company-verification.actions'

export const companyVerificationFeatureKey ='company-verification';

export interface State{
    verifyCompany:boolean,
}

const initialState :State={
    verifyCompany:false,
}

export const reducer = createReducer(
    initialState,
    on(fromCompanyVerification.verificationValueChanged, (state,action) => {
        return {
            ...state,
            verifyCompany:action.toggleValue,
        }
    })
)
