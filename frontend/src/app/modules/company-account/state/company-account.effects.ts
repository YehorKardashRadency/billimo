import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { concatMap, tap, map, catchError, of, mergeMap } from 'rxjs';
import { CompanyAccountService } from 'src/app/modules/company-account/components/services/CompanyService';
import {
  SuccessModalRedirectComponent,
  SuccessModalRedirectData,
} from 'src/app/shared/success-modal-redirect/success-modal-redirect.component';
import * as fromCompanyAccountActions from '../../../store/actions/company-account.actions';
import * as fromDialogActions from '../../../store/actions/dialog.actions';
import * as fromSpinnerActions from '../../../store/actions/spinner.actions';
import { AddressModalComponent } from '../components/address-modal/address-modal.component';
import { AddEmployeeModalComponent } from '../components/employees/components/add-employee-modal/add-employee-modal.component';

@Injectable()
export class CompanyAccountEffects {
  showLoading$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromCompanyAccountActions.fetchAddresses),
      map(() => fromSpinnerActions.showSpinner())
    );
  });
  hideLoading$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromCompanyAccountActions.fetchAddressesSuccess),
      map(() => fromSpinnerActions.hideSpinner())
    );
  });
  fetchAddresses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromCompanyAccountActions.fetchAddresses),
      concatMap((action) =>
        this.companyAccountService.getAddresses().pipe(
          map((addresses) => {
            if (action.afterUpdate) this.dialog.closeAll();
            return fromCompanyAccountActions.fetchAddressesSuccess({
              addressesList: addresses,
            });
          }),
          catchError((error) =>
            of(
              fromCompanyAccountActions.fetchAddressesFailure({
                error: error?.error?.errors ?? {},
              })
            )
          )
        )
      )
    );
  });
  updateAddress$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromCompanyAccountActions.updateAddress),
      concatMap((action) =>
        this.companyAccountService.updateAddress(action.address).pipe(
          map(() => fromCompanyAccountActions.fetchAddresses(true)),
          catchError((error) =>
            of(
              fromCompanyAccountActions.updateAddressesFailure({
                error: error?.error?.errors ?? {},
              })
            )
          )
        )
      )
    );
  });
  toggleDefaultAddress$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromCompanyAccountActions.toggleAddress),
      concatMap((action) =>
        this.companyAccountService.toggleDefaultAddress(action.id).pipe(
          map(() =>
            fromCompanyAccountActions.toggleAddressSuccess({ id: action.id })
          ),
          catchError((error) =>
            of(
              fromCompanyAccountActions.updateAddressesFailure({
                error: error?.error?.errors ?? {},
              })
            )
          )
        )
      )
    );
  });
  addAddress$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromCompanyAccountActions.addAddress),
      concatMap((action) =>
        this.companyAccountService.addAddress(action.address).pipe(
          map(() => fromCompanyAccountActions.addAddressSuccess()),
          catchError((error) =>
            of(
              fromCompanyAccountActions.updateAddressesFailure({
                error: error?.error?.errors ?? {},
              })
            )
          )
        )
      )
    );
  });
  openAddAddressSuccessDialog = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromCompanyAccountActions.addAddressSuccess),
        map(() => {
          this.dialog.closeAll();
          const data: SuccessModalRedirectData = {
            title: 'Success',
            text: 'Your new address has been successfully added. You can see it on tab Addresses in your Company account.',
            primaryButton: { label: 'Go to Company Account' },
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
  addressEditDialogOpened$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromDialogActions.openAddressEditDialog),
        mergeMap((action) => {
          const dialogRef = this.dialog.open(AddressModalComponent, {
            data: {
              address: action.address,
              defaultAddressId: action.defaultAddressId,
            },
            disableClose: true,
          });
          return dialogRef.afterClosed();
        })
      ),
    { dispatch: false }
  );
  openAddUserDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromDialogActions.openAddUserDialog),
        mergeMap((action) => {
          const dialogRef = this.dialog.open(AddEmployeeModalComponent, {
            disableClose: true
          });
          return dialogRef.afterClosed();
        })
      ),
    { dispatch: false }
  );
  dialogClosed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromDialogActions.closeDialogs),
        tap(() => {
          this.dialog.closeAll();
        })
      ),
    { dispatch: false }
  );
  addAddressSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromCompanyAccountActions.addAddressSuccess),
      map(() => fromCompanyAccountActions.fetchAddresses(false))
    );
  });
  deleteAddress$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromCompanyAccountActions.deleteAddress),
      concatMap((action) =>
        this.companyAccountService.deleteAddress(action.id).pipe(
          map(() => fromCompanyAccountActions.fetchAddresses(true)),
          catchError((error) =>
            of(
              fromCompanyAccountActions.updateAddressesFailure({
                error: error?.error?.errors ?? {},
              })
            )
          )
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private companyAccountService: CompanyAccountService,
    private dialog: MatDialog
  ) {}
}
