import { createAction, props } from '@ngrx/store';
import { Employee } from "../resources/models/employee";
import { RegisterEmployee } from '../resources/models/registerEmployee';
import { ValidationErrors } from '@angular/forms';
import { FinishEmployeeRegistration } from '../resources/models/finishEmployeeRegistration';

export const loadEmployees = createAction(
  '[Employee] Load Employees',
);

export const loadEmployeesSuccess = createAction(
  '[Employee] Load Employees Success',
  props<{ employees: Employee[] }>()
);

export const updateEmployeeRole = createAction(
  '[Employee] Update Employee Role',
  props<{id: number, role: number}>()
);

export const resendEmployeeEmail = createAction(
  '[Employee] Resend Employee Email',
  props<{id: number}>()
);

export const addEmployee = createAction(
  '[Employee] Add Employee',
  props<{ employee: RegisterEmployee }>()
);

export const addEmployeeSuccess = createAction(
  '[Employee] Add Employee Success'
);

export const addEmployeeFailure = createAction(
  '[Employee] Add Employee Failure',
  props<{ serverErrors: ValidationErrors }>()
);

export const resendEmployeeEmailSuccess = createAction(
  '[Employee] Resend Employee Email Success'
);

export const resendEmployeeEmailFailure = createAction(
  '[Employee] Resend Employee Email Failure',
  props<{ error: any }>()
);

export const getEmployeeDetails = createAction(
  '[Employee] Get Employee Details',
  props<{ id: number }>()
);

export const getEmployeeDetailsSuccess = createAction(
  '[Employee] Get Employee Details Success',
  props<{ employee: Employee }>()
);

export const getEmployeeDetailsFailure = createAction(
  '[Employee] Get Employee Details Failure',
  props<{ error: any }>()
);

export const persistEmployeeId = createAction(
  '[Employee] Persist Employee Id'
);

export const finishEmployeeRegistration = createAction(
  '[Employee] Finish Employee Registration',
  props<{ id?: number, data: FinishEmployeeRegistration }>()
);

export const finishEmployeeRegistrationSuccess = createAction(
  '[Employee] Finish Employee Registration Success'
);

export const finishEmployeeRegistrationFailure = createAction(
  '[Employee] Finish Employee Registration Failure',
  props<{ error: any }>()
);
