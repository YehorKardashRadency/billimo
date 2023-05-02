import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { InvoiceService } from 'src/app/modules/invoices/resources/services/invoice.service';
import { ButtonConfig } from 'src/app/shared/button/button.component';
import { SuccessModalRedirectComponent, SuccessModalRedirectData } from 'src/app/shared/success-modal-redirect/success-modal-redirect.component';
import { AppState } from 'src/app/store';
import { InvoiceDetailsComponent, InvoiceDetailsDialogData } from '../../../components/invoice-details/invoice-details.component';
import { RequestsInvoicesActions } from '../actions/requests-invoices.actions';
import { InvoiceRequestsConfirmComponent, RequestConfirmData } from './../../../components/invoice-requests-confirm/invoice-requests-confirm.component';
@Injectable()
export class RequestsInvoicesEffects {

  requestsInvoiceDialogOpen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestsInvoicesActions.openRequestsInvoiceDialog),
      tap((action) => {
        const approve = () => {
          this.store.dispatch(RequestsInvoicesActions.openRequestsInvoiceConfirmDialog({ data: action.data }));
        };
        const decline = () => {
          this.store.dispatch(RequestsInvoicesActions.declineInvoice({ id: action.data.invoice.id! }));
        };
        const approveButtonConfig: ButtonConfig = { text: 'Approve invoice', onClick: () => approve(), disabled: false }
        const declineButtonConfig: ButtonConfig = { text: 'Decline', onClick: () => decline(), disabled: false }
        const data: InvoiceDetailsDialogData = {
          invoice: action.data.invoice,
          primaryButton: approveButtonConfig,
          declineButton: declineButtonConfig
        }
        const dialogRef = this.dialog.open(InvoiceDetailsComponent, {
          data
        });
      })
    ), { dispatch: false })
  requestsInvoiceDialogConfirmOpen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestsInvoicesActions.openRequestsInvoiceConfirmDialog),
      tap((action) => {
        this.dialog.closeAll();
        const approve = () => {
          this.store.dispatch(RequestsInvoicesActions.approveInvoice({ data: action.data }));
        };
        const decline = () => {
          this.store.dispatch(RequestsInvoicesActions.declineInvoice({ id: action.data.invoice.id! }));
        };
        const approveButtonConfig: ButtonConfig = { text: 'Approve', onClick: () => approve(), disabled: false }
        const declineButtonConfig: ButtonConfig = { text: 'Decline', onClick: () => decline(), disabled: false }
        const data: RequestConfirmData = {
          title: `Are you sure you want to approve Invoice ${action.data.invoice.number}?`,
          primaryButton: approveButtonConfig,
          declineButton: declineButtonConfig
        }
        const dialogRef = this.dialog.open(InvoiceRequestsConfirmComponent, {
          data
        });
      })
    ), { dispatch: false })
  approveInvoice$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RequestsInvoicesActions.approveInvoice),
      mergeMap((action) =>
        this.invoiceService.acceptPendingInvoice(action.data.invoice.id!).pipe(
          map(() => RequestsInvoicesActions.approveInvoiceSuccess({ data: action.data })),
          catchError((error) => of(RequestsInvoicesActions.approveInvoiceFailure({ error:error?.error?.errors  ?? {}})))
        )
      )
    );
  });
  declineInvoice$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RequestsInvoicesActions.declineInvoice),
      tap(() => this.dialog.closeAll()),
      mergeMap((action) =>
        this.invoiceService.declinePendingInvoice(action.id).pipe(
          map(() => RequestsInvoicesActions.declineInvoiceSuccess()),
          catchError((error) => of(RequestsInvoicesActions.declineInvoiceFailure({ error:error?.error?.errors ?? {} })))
        )
      )
    );
  });
  openSuccessulSendModal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RequestsInvoicesActions.approveInvoiceSuccess),
      tap(action => {
        this.dialog.closeAll();
        const data: SuccessModalRedirectData = {
          text: `Your invoice ${action.data.invoice.number} has been successfully approved. 
         You can track your payments in Bill Payments tab.`,
          primaryButton: {
            label: 'Go to Bill Payments',
            route: '/bills'
          },
          secondaryButton: {
            label: 'Go to Dashboard',
            route: '/dashboard'
          }
        }
        this.dialog.open(SuccessModalRedirectComponent, { data })
      })
    );
  }, { dispatch: false });

  constructor(private actions$: Actions,
    private invoiceService: InvoiceService,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) { }
}
