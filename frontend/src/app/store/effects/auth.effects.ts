import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  catchError,
  concatMap,
  exhaustMap,
  map,
  tap,
} from 'rxjs/operators';

import * as AuthActions from '../actions/auth.actions';
import { AuthService } from 'src/app/modules/auth/resources/services/auth.service';
import { LoginResult } from 'src/app/modules/auth/resources/models/LoginResult';
import {Router} from "@angular/router";

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginPage),
      concatMap((action) =>
        this.authService.post<LoginResult>('/gateway/login', action.loginRequest).pipe(
          map((loginResult) => {
            if (loginResult.twoFactorCodeRequired){
              return AuthActions.twoFactorCodeRequired()
            }else{
              this.authService.logIn(loginResult);
              return AuthActions.loginSuccess({ loginResult: loginResult });
            }
          }),
          catchError((error) => {
            const loginResult = error.error as LoginResult;
            return of(AuthActions.loginFailure({ error: loginResult?.errors  ?? {}}))
          }
          )
        )
      )
    );
  });

  loginFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(() => this.authService.logOut())
      );
    },
    { dispatch: false }
  );

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.logout),
        exhaustMap(() => this.authService.deleteRefreshToken()),
        tap(() => {
          this.authService.logOut();
        })
      );
    },
    { dispatch: false }
  );

  resendTwoFactorCode$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.resendTwoFactorCode),
      concatMap((action) =>
        this.authService.post<LoginResult>('/gateway/resendtwofactorcode', action.loginRequest).pipe(
          map((loginResult) => {
            return AuthActions.resendTwoFactorCodeSuccess();
          }),
          catchError((error) => {
              return of(AuthActions.resendTwoFactorCodeFailure({ error: error?.errors  ?? {}}))
            }
          )
        )
      )
    );
  });

  constructor(private actions$: Actions, private authService: AuthService,
              private router: Router ) {}
}
