import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import * as EmployeeActions from './employee.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../store';
import { selectCompanyId } from '../../../../../store/selectors/auth.selectors';
import { EmployeeService } from '../resources/services/employee.service';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  SuccessModalRedirectData,
  SuccessModalRedirectComponent,
} from 'src/app/shared/success-modal-redirect/success-modal-redirect.component';
import { selectInvitedEmployee } from './employee.selectors';
import * as AuthActions from 'src/app/store/actions/auth.actions';

@Injectable()
export class EmployeeEffects {
  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployees, EmployeeActions.addEmployeeSuccess),
      mergeMap(() =>
        this.store.select(selectCompanyId).pipe(
          mergeMap((companyId) =>
            this.employeeService.getAllEmployees(companyId).pipe(
              map((employees) =>
                EmployeeActions.loadEmployeesSuccess({
                  employees: employees,
                })
              )
            )
          )
        )
      )
    )
  );

  updateEmployeeRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.updateEmployeeRole),
      concatMap((action) =>
        this.employeeService
          .updateEmployeeRole(action.id, action.role)
          .pipe(map(() => EmployeeActions.loadEmployees()))
      )
    )
  );

  resendEmployeeEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.resendEmployeeEmail),
      mergeMap((action) =>
        this.employeeService.resendEmployeeEmail(action.id).pipe(
          map(() => EmployeeActions.resendEmployeeEmailSuccess()),
          catchError((error) =>
            of(
              EmployeeActions.resendEmployeeEmailFailure({
                error: error?.error?.errors,
              })
            )
          )
        )
      )
    )
  );

  addEmployee$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EmployeeActions.addEmployee),
      mergeMap((action) =>
        this.employeeService.addEmployee(action.employee).pipe(
          map(() => EmployeeActions.addEmployeeSuccess()),
          catchError((error) =>
            of(
              EmployeeActions.addEmployeeFailure({
                serverErrors: error?.error?.errors ?? {},
              })
            )
          )
        )
      )
    );
  });

  openSendInvitationSuccessDialog = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(EmployeeActions.addEmployeeSuccess, EmployeeActions.resendEmployeeEmailSuccess),
        map(() => {
          this.dialog.closeAll();
          const data: SuccessModalRedirectData = {
            title: 'Success',
            text: 'An email invitation has been sent to the employee. To finish the registration process they will need to follow the instructions sent to their email.',
            primaryButton: {
              label: 'Go to Company Account',
              route: 'company/employees',
            },
          };
          this.dialog.open(SuccessModalRedirectComponent, {
            disableClose: true,
            data,
          });
        })
      );
    },
    { dispatch: false }
  );

  getEmployeeDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EmployeeActions.getEmployeeDetails),
      mergeMap((action) => {
        return this.employeeService.getEmployeeDetails(action.id).pipe(
          map(employee => EmployeeActions.getEmployeeDetailsSuccess({ employee })),
          catchError(error => of(EmployeeActions.getEmployeeDetailsFailure( { error: error.error.errors })))
        );
      })
    );
  });

  persistEmployeeId$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmployeeActions.persistEmployeeId),
        withLatestFrom(this.store.select(selectInvitedEmployee)),
        tap(([action, employee]) => {
          if (employee) localStorage.setItem('userId', employee.id!.toString());
        })
      ),
    { dispatch: false }
  );

  finishEmployeeRegistration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EmployeeActions.finishEmployeeRegistration),
      withLatestFrom(this.store.select(selectInvitedEmployee)),
      mergeMap(([action, employee]) => {
        action.id = +localStorage.getItem('userId')!;
        return this.employeeService.finishEmployeeRegistration(action.id, action.data).pipe(
          map(_ => {
            localStorage.removeItem('userId');
            return AuthActions.loginPage( { loginRequest: { email: employee?.email!, password: action.data.newPassword }} );
          }),
          catchError(error => of(EmployeeActions.finishEmployeeRegistrationFailure( { error: error.error.errors })))
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) {}
}
