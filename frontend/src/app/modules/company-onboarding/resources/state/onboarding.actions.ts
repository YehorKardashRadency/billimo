import { ValidationErrors } from '@angular/forms';
import { createAction, props } from '@ngrx/store';
import { CompanyRegistrationForm } from 'src/app/modules/company-onboarding/resources/models/CompanyRegistrationForm';
import { CompanyValidationForm } from 'src/app/modules/company-onboarding/resources/models/CompanyValidationForm';

export const saveForm = createAction('[Company Onboarding] Registration first stage',
    props<{ form: CompanyValidationForm }>());
export const successSaveForm = createAction('[Company Onboarding] Registration first stage successfully saved',
    props<{ form: CompanyValidationForm }>());
export const failureSaveForm = createAction('[Company Onboarding] Registration first stage save failure',
    props<{ form: CompanyValidationForm, serverErrors: ValidationErrors }>());


export const verifyCompany = createAction('[Company Verification] Verificating company',
    props<{ businessType: string }>());
export const companyVerified = createAction('[Company Verification] Company verified');

export const registerCompany = createAction('[Company Onboarding] Registering Company', props<{ form: CompanyRegistrationForm }>());
export const successRegisterCompany = createAction('[Company Onboarding] Successfully registrated', props<{ form: CompanyRegistrationForm }>());
export const failureRegisterCompany = createAction('[Company Onboarding] Registration failure',
    props<{ form: CompanyRegistrationForm, serverErrors: ValidationErrors }>());
export const openSuccessfullRegistrationDialog = createAction('[Company Onboarding] Open successfull registration dialog')
