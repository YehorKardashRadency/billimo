import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
  import { environment } from '../../environments/environment';
  import * as fromAuth from './reducers/auth.reducer';
  import * as fromCompanyAccount from './reducers/company-account.reducer';
  import * as fromSpinner from './reducers/spinner.reducer';
  import * as fromRouter from '@ngrx/router-store';
  import * as fromCurrentInvoices from '../modules/invoices/resources/state/reducers/invoices.reducers'
  import * as fromTemplates from '../modules/invoices/resources/state/reducers/templates.reducer'
  import * as fromOnboarding from '../modules/company-onboarding/resources/state/onboarding.reducer';
  import * as fromCompany from './reducers/company.reducer';
  import * as fromCompanyVerification from './reducers/company-verification.reducers'
  export interface AppState {
    router: fromRouter.RouterReducerState;
    [fromAuth.authFeatureKey]: fromAuth.State;
    [fromSpinner.spinnerFeatureKey]: fromSpinner.State;
    [fromCurrentInvoices.invoicesFeatureKey]: fromCurrentInvoices.State;
    [fromTemplates.templatesFeatureKey]: fromTemplates.State;
    [fromCompanyAccount.companyAccountFeatureKey]: fromCompanyAccount.State;
    [fromOnboarding.onboardingFeatureKey]: fromOnboarding.State;
    [fromCompany.companyFeatureKey]: fromCompany.State;
    [fromCompanyVerification.companyVerificationFeatureKey]:fromCompanyVerification.State;
  }

export const routerKey = "router";
  export const reducers: ActionReducerMap<AppState> = {
    [fromAuth.authFeatureKey]: fromAuth.reducer,
    [fromSpinner.spinnerFeatureKey]: fromSpinner.reducer,
    [fromCurrentInvoices.invoicesFeatureKey]:fromCurrentInvoices.reducer,
    [routerKey]: fromRouter.routerReducer,
    [fromCompanyAccount.companyAccountFeatureKey]: fromCompanyAccount.reducer,
    [fromOnboarding.onboardingFeatureKey]: fromOnboarding.reducer,
    [fromCompany.companyFeatureKey]: fromCompany.reducer,
    [fromTemplates.templatesFeatureKey]: fromTemplates.reducer,
    [fromCompanyVerification.companyVerificationFeatureKey]: fromCompanyVerification.reducer,
  };

 
  export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
    return function (state, action) {
       console.log('state', state);
       console.log('action', action);

      return reducer(state, action);
    };
  }
  
export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [debug]
  : [];
