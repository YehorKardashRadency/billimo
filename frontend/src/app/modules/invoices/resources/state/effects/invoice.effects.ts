import {Router} from '@angular/router';
import {
  SuccessModalRedirectData,
  SuccessModalRedirectButton,
  SuccessModalRedirectComponent
} from 'src/app/shared/success-modal-redirect/success-modal-redirect.component';
import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap, tap} from 'rxjs/operators';

import {MatDialog} from '@angular/material/dialog';
import {InvoiceService} from 'src/app/modules/invoices/resources/services/invoice.service';
import * as invoiceActions from '../actions/invoice.actions';
import {ApprovalStatus} from 'src/app/shared/models/ApprovalStatus';

import {ModalService} from "../../../../../core/resources/services/modal.service";

import {
  FailedModalRedirectButton,
  FailedModalRedirectComponent, FailedModalRedirectData
} from "../../../../../shared/failed-modal-redirect/failed-modal-redirect.component";

@Injectable()
export class InvoiceEffects {
  create$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invoiceActions.createInvoicePage),
      mergeMap((action) =>
        this.invoiceService.createInvoice(action.invoice).pipe(
          map((invoiceResult) => invoiceActions.createInvoiceSuccess({
            invoice: action.invoice,
            result: invoiceResult
          })),
          catchError((error) => of(invoiceActions.createInvoiceFailure({ error: error })))
        )
      )
    );
  });

  failureCreate$ = createEffect((() => {
    return this.actions$.pipe(
      ofType(invoiceActions.createInvoiceFailure),
      tap(error => {
        const button:FailedModalRedirectButton= {
          label: 'Add Payment Method',
          route: '/company/payment-methods'
        };
        const data: FailedModalRedirectData ={
          primaryButton: button,
          error: error.error.error.detail
        };
        this.modalService.openModal(
          FailedModalRedirectComponent,
            data
          );
        }
      )
    )
  }),{dispatch: false});

  saveEditedInvoice$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invoiceActions.editInvoice),
      mergeMap((action) =>
        this.invoiceService.editInvoice(action.invoiceToEdit).pipe(
          map(_ => {
            return invoiceActions.editInvoiceSuccess({invoiceToSave: action.invoiceToEdit});
          }),
                catchError(error => of(invoiceActions.editInvoiceFailure({errors:error?.error?.errors ?? {}})))
        )
      ),
      tap(() => this.router.navigateByUrl('invoices/current'))
    )
  });
  showModal$ = createEffect(() =>
      this.actions$.pipe(
        ofType(invoiceActions.createInvoiceSuccess),
        mergeMap((action) => {
          const receiver = action.invoice.buyerName ?? action.invoice.buyerEmail;
          const primaryButton: SuccessModalRedirectButton = action.result.approvalStatus == ApprovalStatus.Approved && action.invoice.send
            ? {label: 'Go to Bill Payments', route: '/bills'}
            : {label: 'Go to Invoices', route: '/invoices'}
          const modalText = action.result.approvalStatus == ApprovalStatus.Approved && action.invoice.send
            ? `Your invoice ${action.invoice.number} has been successfully created and
         sent to ${receiver}. You can track it’s status on the Bill Payments tab.`
            : `Your invoice ${action.invoice.number} has been successfully created and
        ${action.invoice.send ? 'is waiting to be approved' : 'saved'}. You can track it’s status on the Invoices tab.`
          const data: SuccessModalRedirectData = {
            title: 'Thank you!',
            maxWidth: "550px",
            text: modalText,
            primaryButton,
            secondaryButton: {
              label: 'Go to Dashboard',
              route: '/dashboard'
            }
          }
          const dialogRef = this.dialog.open(SuccessModalRedirectComponent, {
            disableClose: true,
            data
          });
          return dialogRef.afterClosed();
        })
      ),
    {dispatch: false});


  getInvoiceNumber$ = createEffect(
    () => this.actions$.pipe(
      ofType(invoiceActions.getInvoiceNumber),
      mergeMap(() => this.invoiceService.getInvoiceNumber().pipe(
          map((invoiceNumber) => invoiceActions.getInvoiceNumberSuccess({invoiceNumber: invoiceNumber})),
        )
      )
    ));


  constructor(private actions$: Actions,
              private invoiceService: InvoiceService,
              private dialog: MatDialog, private router: Router,
              private modalService: ModalService) {
  }
}
