import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectCompanyAccountState } from '../../../state/company-account.selector';
import * as EmployeeReducer from './employee.reducer';

export const selectEmployeesState = createSelector(
  selectCompanyAccountState,
  (state) => state.employee
);

export const selectEmployees = createSelector(
  selectEmployeesState,
  (state) => state.employees
);

export const selectServerErrors = createSelector(
  selectEmployeesState,
  (state) => state.serverErrors
);

export const selectInvitedEmployee = createSelector(
  selectEmployeesState,
  (state) => state.invitedEmployee
);

export const selectRegistrationError = createSelector(
  selectEmployeesState,
  (state) => state.registrationError
);
