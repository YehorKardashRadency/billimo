import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as fromAuthActions from '../actions/auth.actions';
import { tap } from 'rxjs/operators';
import { ModalService } from 'src/app/modules/invoices/resources/services/modal.service';
import { InvoicesActions } from 'src/app/modules/invoices/resources/state/actions/invoices.actions';

@Injectable()
export class ModalEffects {
  hideModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuthActions.loginSuccess),
        tap(() => {
          // hide modal
        })
      ),
    { dispatch: false }
  );

  hideInvoiceDetails$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InvoicesActions.archiveInvoiceSuccess),
        tap(() => {
          this.invoiceModalService.hide();
        })
      ),
    { dispatch: false }
  );


  constructor(private actions$: Actions,
              private invoiceModalService: ModalService) {}
}
