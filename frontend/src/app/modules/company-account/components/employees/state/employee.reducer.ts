import { createReducer, on } from '@ngrx/store';
import * as EmployeeActions from './employee.actions';
import { Employee } from '../resources/models/employee';
import { ValidationErrors } from '@angular/forms';

export const employeeFeatureKey = 'employee';

export interface EmployeeState {
  employees: Employee[];
  serverErrors: ValidationErrors | null;
  invitedEmployee: Employee | null;
  registrationError: string | null;
}

export const initialState: EmployeeState = {
  employees: [],
  serverErrors: null,
  invitedEmployee: null,
  registrationError: null
};

export const employeeReducer = createReducer(
  initialState,

  on(EmployeeActions.loadEmployeesSuccess, (state, action) => ({
    ...state,
    employees: action.employees,
    serverErrors: null,
    registrationError: null
  })),
  on(EmployeeActions.addEmployeeFailure, (state, action) => {
    return {
      ...state,
      serverErrors: action.serverErrors
    };
  }),
  on(EmployeeActions.getEmployeeDetailsSuccess, (state, action) => {
    return {
      ...state,
      invitedEmployee: action.employee,
      serverErrors: null,
      registrationError: null
    };
  }),
  on(EmployeeActions.finishEmployeeRegistrationFailure, (state, action) => {
    return {
      ...state,
      registrationError: action.error
    };
  }),
);
