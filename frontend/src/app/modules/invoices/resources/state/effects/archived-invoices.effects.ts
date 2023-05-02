import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, of, switchMap } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { InvoiceService } from 'src/app/modules/invoices/resources/services/invoice.service';
import { InvoiceDetailsComponent, InvoiceDetailsDialogData } from '../../../components/invoice-details/invoice-details.component';
import { ArchivedInvoicesActions } from '../actions/archived-invoices.actions';
import * as invoiceActions from '../actions/invoice.actions';
import { InvoicesActions } from '../actions/invoices.actions';
import { RequestsInvoicesActions } from './../actions/requests-invoices.actions';
@Injectable()
export class ArchivedInvoices {
    constructor(private actions$: Actions, private invoiceService: InvoiceService, private dialog: MatDialog) {

    }
    setLoading$ = createEffect(
        () => this.actions$.pipe(
            ofType(ArchivedInvoicesActions.getArchivedInvoices),
            map(_ => ArchivedInvoicesActions.setLoading({ loading: true }))
        )
    );
    getArchivedInvoices$ = createEffect(
        () => this.actions$.pipe(
            ofType(ArchivedInvoicesActions.getArchivedInvoices,
                invoiceActions.createInvoiceSuccess,
                InvoicesActions.archiveInvoiceSuccess,
                InvoicesActions.sendInvoiceSuccess,
                RequestsInvoicesActions.approveInvoiceSuccess),
            switchMap(_ => this.invoiceService.getArchivedInvocies().pipe(
                map(result => {
                    return ArchivedInvoicesActions.getArchivedInvoicesSucess({ invoices: result });
                }),
                catchError(_ => {
                    return of(ArchivedInvoicesActions.getArhivedInvoicesFailure({ error: 'errors' }));
                })
            )
            )
        )
    );
    currentInvoiceDialogOpen$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ArchivedInvoicesActions.openArchivedInvoiceDialog),
            tap((action) => {
                const data: InvoiceDetailsDialogData = {
                    invoice: action.data.invoice,
                }
                const dialogRef = this.dialog.open(InvoiceDetailsComponent, {
                    data
                });
            })
        ), { dispatch: false })
}
