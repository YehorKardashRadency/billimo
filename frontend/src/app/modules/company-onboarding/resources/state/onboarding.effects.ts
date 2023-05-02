import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, mergeMap, of, tap } from 'rxjs';
import { LoginResult } from 'src/app/modules/auth/resources/models/LoginResult';
import * as fromOnboardingActions from './onboarding.actions';
import { AuthService } from '../../../auth/resources/services/auth.service';
import { OnboardingService } from '../services/onboarding.api.service';
import { SuccessModalRedirectComponent, SuccessModalRedirectData } from 'src/app/shared/success-modal-redirect/success-modal-redirect.component';
import { HttpParams } from '@angular/common/http';
@Injectable()
export class OnboardingEffects {
    validateRegistration$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(fromOnboardingActions.saveForm),
            concatMap((action) => {
                return this.onboardingService.ValidateRegistrationForm(action.form).pipe(
                    map(_ => {
                        this.router.navigateByUrl('company-onboarding/verification')
                        return fromOnboardingActions.successSaveForm({ form: action.form })
                    }),
                    catchError(errorResponse => {
                        return of(fromOnboardingActions.failureSaveForm({ form: action.form, serverErrors: errorResponse?.error?.errors ?? {} }))
                    }));
            })
        );
    });
    verifyCompany$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(fromOnboardingActions.verifyCompany),
            tap(_ => {
                this.router.navigateByUrl('company-onboarding/address')
            })
        );
    }, { dispatch: false });
    registerCompany$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(fromOnboardingActions.registerCompany),
            concatMap((action) => {
                const billId = localStorage.getItem('billId');
                const params: HttpParams = !!billId ? new HttpParams().set('billId', billId) : new HttpParams();
                localStorage.removeItem('billId');
                return this.onboardingService.RegisterCompany(action.form, params).pipe(
                    map(_ => {
                        return fromOnboardingActions.successRegisterCompany({ form: action.form })
                    }),
                    catchError(errorResponse => {
                        return of(fromOnboardingActions.failureRegisterCompany({ form: action.form, serverErrors: errorResponse?.error?.errors  ?? {}}))
                    }));
            })
        );
    });
    successRegisterCompany$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(fromOnboardingActions.successRegisterCompany),
            concatMap((action) => {
                return this.authService.post<LoginResult>("/gateway/login", {
                    email: action.form.companyData.email,
                    password: action.form.companyData.password
                }).pipe(
                    map((loginResult) => {
                        this.authService.logIn(loginResult);
                        return fromOnboardingActions.openSuccessfullRegistrationDialog();
                    },
                    )
                )
            })
        );
    });
    successfullRegistrationOpened$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(fromOnboardingActions.openSuccessfullRegistrationDialog),
                mergeMap(() => {
                    const data: SuccessModalRedirectData = {
                        title: "Thank you!",
                        text: "Our team is looking forward to verifying your company. We will reach out to you within 24 hours. You can already check your Dashboard.",
                        primaryButton: {label:"Go to Dashboard", route:"/dashboard"}
                    }
                    const dialogRef = this.dialog.open(SuccessModalRedirectComponent, {
                        disableClose: true,
                        data
                    });
                    return dialogRef.afterClosed();
                })
            ),

        { dispatch: false }
    );
    constructor(private actions$: Actions, private onboardingService: OnboardingService,
        private router: Router,
        private authService: AuthService,
        private dialog: MatDialog) { }
}
