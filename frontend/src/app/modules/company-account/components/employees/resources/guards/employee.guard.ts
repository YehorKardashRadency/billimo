import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { catchError, filter, Observable, of, switchMap, take, tap } from 'rxjs';
import * as CompanyAccountReducer from '../../../../state/company-account.reducer';
import { selectInvitedEmployee } from '../../state/employee.selectors';
import * as EmployeeActions from '../../state/employee.actions';

@Injectable({
  providedIn: 'root',
})
export class EmployeeGuard implements CanActivate {
  constructor(private store: Store<CompanyAccountReducer.State>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const employeeId = +route.paramMap.get('userId')!!;
    return this.store.pipe(
      select(selectInvitedEmployee),
      tap((employee) => {
        if (!employee) {
          this.store.dispatch(EmployeeActions.getEmployeeDetails({ id: employeeId!! }));
        }
      }),
      filter((employee) => !!employee && employee.id === employeeId),
      take(1),
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }
}
