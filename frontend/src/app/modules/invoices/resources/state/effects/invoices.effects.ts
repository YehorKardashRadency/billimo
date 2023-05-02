import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ArchivedInvoicesActions } from '../actions/archived-invoices.actions';
import { SuccessModalRedirectComponent, SuccessModalRedirectData } from '../../../../../shared/success-modal-redirect/success-modal-redirect.component';
import { Injectable } from '@angular/core';
import { catchError, mergeMap, of, take, tap, lastValueFrom } from 'rxjs';
import { map, switchMap } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { InvoiceService } from 'src/app/modules/invoices/resources/services/invoice.service';
import { InvoicesActions } from '../actions/invoices.actions';
import * as invoiceActions from '../actions/invoice.actions';
import { ButtonConfig } from 'src/app/shared/button/button.component';
import { InvoiceDetailsDialogData, InvoiceDetailsComponent } from '../../../components/invoice-details/invoice-details.component';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { RequestsInvoicesActions } from '../actions/requests-invoices.actions';
import { ApprovalStatus } from 'src/app/shared/models/ApprovalStatus';
import { selectRole } from 'src/app/store/selectors/auth.selectors';
import { Role } from 'src/app/modules/auth/resources/models/Role';
import { hideSpinner } from 'src/app/store/actions/spinner.actions';
import { closeDialogs } from 'src/app/store/actions/dialog.actions';

@Injectable()
export class GetCurrentInvoicesEffects {
    hideSpinner$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(InvoicesActions.getInvoicesSuccess),
            switchMap((action) => {
               return of(hideSpinner())
            })
        )
    })
    getCurrentInvoices$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(InvoicesActions.getInvoices,
                InvoicesActions.archiveInvoiceSuccess,
                invoiceActions.createInvoiceSuccess,
                InvoicesActions.sendInvoiceSuccess,
                RequestsInvoicesActions.approveInvoiceSuccess,
                RequestsInvoicesActions.declineInvoiceSuccess),
            switchMap((action) => {
                return this.invoiceService.getCurrentInvoices().pipe(
                    map(invoices => {
                        return InvoicesActions.getInvoicesSuccess({ invoices: invoices })
                    }),
                    catchError(error => of(InvoicesActions.getInvoicesFailure({error:error?.error?.errors ?? {}}))),
                )
            })
        )
    });
    send$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(InvoicesActions.sendInvoice),
            mergeMap((action) =>
                this.invoiceService.sendInvoice(action.invoice.id!).pipe(
                    map(() => InvoicesActions.sendInvoiceSuccess({ invoice: action.invoice })),
                    catchError((error) => of(InvoicesActions.sendInvoiceFailure({ error:error?.error?.errors  ?? {}})))
                )
            )
        );
    });
    openSuccessulSendModal$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(InvoicesActions.sendInvoiceSuccess),
            tap(action => {
                this.dialog.closeAll();
                const data: SuccessModalRedirectData = {
                    text:`Your invoice ${action.invoice.number} has been successfully sent to ${action.invoice.company?.name ?? action.invoice.buyerEmail}. 
                    You can track it’s status on the Bill Payments tab.`,
                    primaryButton: {
                        label: 'Go to Bill Payments',
                        route:'/bills/'
                    },
                    secondaryButton: {
                        label: 'Go to Dashboard',
                        route:'/dashboard'
                    }
                } 
                this.dialog.open(SuccessModalRedirectComponent,{data})
            })
        );
    },{dispatch:false});
    currentInvoiceDialogOpen$ = createEffect(() =>
        this.actions$.pipe(
            ofType(InvoicesActions.openCurrentInvoiceDialog),
            tap( async (action) => {
                const userRole = await lastValueFrom(this.store.pipe(select(selectRole),take(1)));
                
                const addToArchive = () => {
                    this.store.dispatch(InvoicesActions.archiveInvoice({ id: action.data.invoice.id! }));
                };
                const sendInvoice = () => {
                    this.store.dispatch(InvoicesActions.sendInvoice({ invoice: action.data.invoice }));
                };
                const editInvoice = () => {
                    this.store.dispatch(InvoicesActions.setInvoiceFormData({ invoice: action.data.invoice, isEditing: true }));
                    this.store.dispatch(closeDialogs());
                    this.router.navigateByUrl('invoice/edit');
                };
                const archiveButtonConfig: ButtonConfig = { text: 'Move to archive', onClick: () => addToArchive(), disabled: false }
                const sendButtonConfig: ButtonConfig = {
                    text: 'Send', onClick: () => sendInvoice(),
                    disabled: action.data.invoice.approvalStatus == ApprovalStatus.Pending
                        && userRole != Role.Admin
                        && userRole != Role.Director
                }
                const editButtonConfig: ButtonConfig = {text:'Edit',onClick:()=>editInvoice()}
                const data: InvoiceDetailsDialogData = {
                    invoice: action.data.invoice,
                    primaryButton: action.data.invoice.approvalStatus==ApprovalStatus.RequiresUpdates ? editButtonConfig : sendButtonConfig,
                    secondaryButton: archiveButtonConfig,
                    isEditingMode:action.data.isEditingMode,
                }
                const dialogRef = this.dialog.open(InvoiceDetailsComponent, {
                    data
                });
            })
        ), { dispatch: false })
    deleteInvoiceEffect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(InvoicesActions.deleteInvoice),
            switchMap((action) => {
                return this.invoiceService.deleteInvoice(action.invoiceId).pipe(
                    map(_ => InvoicesActions.deleteSuccess({ invoiceId: action.invoiceId })),
                    catchError(error => of(InvoicesActions.deleteFailure({error:error?.error?.errors ?? {}})))
                )
            })
        )
    })
    archiveInvoiceEffect$ = createEffect(() => {
        return this.actions$.pipe(
          ofType(InvoicesActions.archiveInvoice),
          mergeMap((action) =>
            this.invoiceService.archiveInvoice(action.id).pipe(
              map(() => InvoicesActions.archiveInvoiceSuccess()),
              catchError((error) => of(InvoicesActions.archiveInvoiceFailure({ error: error?.error?.errors ?? {}})))
            )
          )
        );
    });
    deselectAllExportedAfterFilterChange$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(InvoicesActions.setCompanyFilter),
            map((action) => ArchivedInvoicesActions.removeAllInvoicesFromExported())
        )
    });

    
    constructor(private actions$: Actions,
        private invoiceService: InvoiceService,
        private dialog: MatDialog,
        private store: Store<AppState>, private router:Router) { }
}
