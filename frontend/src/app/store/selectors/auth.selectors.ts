import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Role } from 'src/app/modules/auth/resources/models/Role';
import { User } from 'src/app/modules/auth/resources/models/User';
import * as fromAuth from '../reducers/auth.reducer';

export const selectAuthState = createFeatureSelector<fromAuth.State>(
  fromAuth.authFeatureKey
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state: fromAuth.State): boolean | null => state.isLoggedIn
);

export const selectRole = createSelector(
  selectAuthState,
  (state: fromAuth.State): Role => state.user?.role ?? Role.Empty
);
export const selectUser = createSelector(
  selectAuthState,
  (state: fromAuth.State): User | null => state.user
);

export const selectCompanyId = createSelector(
  selectAuthState,
  (state: fromAuth.State) => state.user?.companyId ?? 0
);

export const selectTwoFactorRequired = createSelector(
  selectAuthState,
  (state: fromAuth.State) => !state.isLoggedIn && state.twoFactorCodeRequired
);

export const selectErrors = createSelector(
  selectAuthState,
  (state: fromAuth.State) => state.error
)

