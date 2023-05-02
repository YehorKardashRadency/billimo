import { InvoiceDetailsComponent } from '../../modules/invoices/components/invoice-details/invoice-details.component';
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs";
import { mergeMap } from 'rxjs/operators';
import { AddressModalComponent } from 'src/app/modules/company-account/components/address-modal/address-modal.component';
import { ConfirmationModalExampleComponent } from '../../shared/confirmation-modal-example/confirmation-modal-example.component';
import { DialogComponent } from '../../shared/success-modal-example/dialog.component';
import * as fromDialogActions from '../actions/dialog.actions';
import { AddressAddedModalComponent } from './../../modules/company-account/components/address-added-modal/address-added-modal.component';
import { RegistrationSuccessModalComponent } from './../../modules/company-onboarding/registration-success-modal/registration-success-modal.component';
import { TermsAndConditionsModalComponent } from './../../modules/company-onboarding/terms-and-conditions-modal/terms-and-conditions-modal.component';

@Injectable()
export class DialogEffects {
    successDialogOpened$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(fromDialogActions.openExampleSuccessDialog),
                mergeMap(() => {
                    const dialogRef = this.dialog.open(DialogComponent);
                    return dialogRef.afterClosed();
                })
            ),
        { dispatch: false }
    );

    confirmationDialogOpened$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(fromDialogActions.openExampleConfirmationDialog),
                mergeMap(() => {
                    const dialogRef = this.dialog.open(ConfirmationModalExampleComponent);
                    return dialogRef.afterClosed();
                })
            ),
        { dispatch: false }
    );
    termsAndConditionsDialogOpened$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(fromDialogActions.openTermsAndConditionsDialog),
                mergeMap(() => {
                    const dialogRef = this.dialog.open(TermsAndConditionsModalComponent);
                    return dialogRef.afterClosed();
                })
            ),
        { dispatch: false }
    );
    
    successfullAddressAddedOpened$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(fromDialogActions.openSuccessfullAddressAddedDialog),
                mergeMap(() => {
                    const dialogRef = this.dialog.open(AddressAddedModalComponent, {
                        disableClose: true
                    });
                    return dialogRef.afterClosed();
                })
            ),
        { dispatch: false }
    );
    constructor(private actions$: Actions, private dialog: MatDialog, private router: Router) { }
}
