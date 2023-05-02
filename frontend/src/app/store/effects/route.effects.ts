import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import * as fromAuthActions from '../actions/auth.actions';
import { tap } from 'rxjs/operators';
import {redirectToPayReceivedBillPage} from '../../modules/bills/resources/state/received/received.bill.actions';

@Injectable()
export class RouteEffects {
  gohome$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuthActions.logout),
        tap(() => this.router.navigate(['/']))
      ),
    { dispatch: false }
  );

  loginFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuthActions.loginFailure),
        tap(() => this.router.navigate(['/login']))
      ),
    { dispatch: false }
  );

  loginSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromAuthActions.loginSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      );
    },
    { dispatch: false }
  );

  payBill$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(redirectToPayReceivedBillPage),
        tap((action) => this.router.navigate([action.route]))
      );
    },
    { dispatch: false }
  );
  constructor(private actions$: Actions, private router: Router) {}
}
