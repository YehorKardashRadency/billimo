import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromAuthActions from '../actions/auth.actions';
import * as fromPaymentMethodsActions from '../../modules/company-account/components/payment-methods/state/payment-methods.actions';
import * as fromDocumentsActions from '../../modules/company-account/components/documents/state/documents.actions';
import * as fromApprovalActions from '../../modules/company-account/components/approval-settings/state/approval-settings.actions';
import * as fromSettingsActions from '../../modules/settings/state/settings-page.actions';
import { tap } from 'rxjs/operators';
import * as fromSpinnerActions from '../actions/spinner.actions'
import {Store} from "@ngrx/store";

@Injectable()
export class SpinnerEffects {
  spinneron$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          fromAuthActions.loginPage, fromAuthActions.resendTwoFactorCode,
          fromPaymentMethodsActions.loadPaymentMethods, fromPaymentMethodsActions.exchangeLinkToken,
          fromDocumentsActions.loadDocuments, fromDocumentsActions.updateDocuments,
          fromApprovalActions.updateApprovalSettings,
          fromSettingsActions.loadUserSettings, fromSettingsActions.updateEmailSettings,
        ),
        tap(() =>  {
          this.store$.dispatch(fromSpinnerActions.showSpinner());
        })
      ),
    { dispatch: false }
  );

  spinneroff$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          fromAuthActions.loginSuccess, fromAuthActions.loginFailure, fromAuthActions.twoFactorCodeRequired,
          fromAuthActions.resendTwoFactorCodeSuccess, fromAuthActions.resendTwoFactorCodeFailure,
          fromPaymentMethodsActions.loadPaymentMethodsSuccess, fromPaymentMethodsActions.loadPaymentMethodsFailure,
          fromPaymentMethodsActions.exchangeLinkTokenSuccess, fromPaymentMethodsActions.exchangeLinkTokenFailure,
          fromDocumentsActions.loadDocumentsSuccess, fromDocumentsActions.loadDocumentsFailed,
          fromDocumentsActions.updateDocumentsSuccess, fromDocumentsActions.updateDocumentsFailed,
          fromApprovalActions.updateApprovalSettingsSuccess, fromApprovalActions.updateApprovalSettingsFailed,
          fromSettingsActions.loadUserSettingsSuccess, fromSettingsActions.loadUserSettingsFailed,
          fromSettingsActions.updateEmailSettingsSuccess, fromSettingsActions.updateEmailSettingsFailed,
        ),
        tap(() => {
          setTimeout(() => {
            this.store$.dispatch(fromSpinnerActions.hideSpinner());
          }, 1000);
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private store$: Store) {}
}
