import { createReducer, on } from '@ngrx/store';
import { User } from 'src/app/modules/auth/resources/models/User';
import * as fromAuthActions from '../actions/auth.actions';
import * as fromCoreActions from '../actions/core.actions';

export const authFeatureKey = 'auth';

export interface State {
  user: User | null;
  error: any;
  isLoggedIn: boolean | null;
  twoFactorCodeRequired: boolean;
}

export const initialState: State = {
  user: null,
  error: null,
  isLoggedIn:null,
  twoFactorCodeRequired: false,
};

export const reducer = createReducer(
  initialState,

  on(fromAuthActions.loginSuccess, (state, action) => {
    return {
      ...state,
      error: null,
      isLoggedIn:true,
      twoFactorCodeRequired: false,
    };
  }),
  on(fromAuthActions.loginFailure, (state, action) => {
    return {
      ...state,
      user: null,
      error: action.error,
      isLoggedIn:false,
    };
  }),
  on(fromAuthActions.logout, (state) => {
    return {
      ...state,
      user: null,
      error: null,
      isLoggedIn: false
    };
  }),
  on(fromAuthActions.twoFactorCodeRequired, (state) => {
    return {
      ...state,
      user: null,
      error: null,
      isLoggedIn:false,
      twoFactorCodeRequired: true,
    };
  }),
  on(fromAuthActions.backToLoginPage, (state) => {
    return {
      ...state,
      user: null,
      error: null,
      isLoggedIn:false,
      twoFactorCodeRequired: false,
    };
  }),
  on(fromCoreActions.coreGetCurrentUserInfoSuccess, (state, action) => {
    return {
      ...state,
      user: action.user,
      error: null,
      isLoggedIn: true
    };
  }),
  on(fromCoreActions.coreGetCurrentUserInfoFailure, (state, action) => {
    return {
      ...state,
      user: null,
      error: action.error,
      isLoggedIn: false
    };
  }),

);
