import { ValidationErrors } from '@angular/forms';
import { createReducer, on } from '@ngrx/store';
import { CompanyValidationForm } from 'src/app/modules/company-onboarding/resources/models/CompanyValidationForm';
import * as fromOnboardingActions from './onboarding.actions';

export const onboardingFeatureKey = 'onboarding';



export interface State {
    registrationForm: CompanyValidationForm;
    businessType: string;
    serverErrors?: ValidationErrors
}

const initialState: State = {
    registrationForm: {
        companyName: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
    },
    businessType: '',
};

export const reducer = createReducer(
    initialState,
    on(fromOnboardingActions.successSaveForm, (state, action) => {
        return {
            ...state,
            registrationForm: action.form,
            serverErrors: undefined
        };
    }),
    on(fromOnboardingActions.failureSaveForm, (state, action) => {
        return {
            ...state,
            registrationForm: action.form,
            serverErrors: action.serverErrors,
        };
    }),
    on(fromOnboardingActions.verifyCompany, (state, action) => {
        return {
            ...state,
            businessType: action.businessType
        };
    }),
    on(fromOnboardingActions.successRegisterCompany, (state, action) => {
        return {
            ...state,
            registrationForm: initialState.registrationForm,
            businessType: '',
            serverErrors: undefined
        };
    }),
);

export const registrationForm = (state: State) => state.registrationForm;
export const serverErrors = (state: State) => state.serverErrors;
export const businessType = (state: State) => state.businessType;

export const onboardingState = (state: State) => {
    return {
        registrationForm: state.registrationForm,
        businessType: state.businessType,
        serverErrors: state.serverErrors,
    }
};
