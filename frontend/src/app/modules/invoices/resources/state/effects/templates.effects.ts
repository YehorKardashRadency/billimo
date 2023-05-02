import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { InvoiceService } from 'src/app/modules/invoices/resources/services/invoice.service';
import { ButtonConfig } from 'src/app/shared/button/button.component';
import { ApprovalStatus } from 'src/app/shared/models/ApprovalStatus';
import { AppState } from 'src/app/store';
import { closeDialogs } from 'src/app/store/actions/dialog.actions';
import { InvoiceDetailsComponent, InvoiceDetailsDialogData } from '../../../components/invoice-details/invoice-details.component';
import { Invoice } from '../../models/Invoice';
import { InvoicesActions } from '../actions/invoices.actions';
import { TemplatesActions } from '../actions/templates.actions';
@Injectable()
export class TemplatesEffects {
  getTemplates$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplatesActions.getTemplates),
      switchMap((action) => {
        return this.invoiceService.getTemplates().pipe(
          map(templates => {
            return TemplatesActions.getTemplatesSuccess({ templates })
          }),
          catchError(error => of(TemplatesActions.getTemplatesFailure({error:error?.error?.errors ?? {}}))),
        )
      })
    )
  });
  templateDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TemplatesActions.openTemplateDialog),
      tap(async (action) => {

        const deleteTemplate = () => {
          this.store.dispatch(TemplatesActions.deleteTemplate({ id: action.data.invoice.id! }));
        };
        const deleteButtonConfig: ButtonConfig = {
          text: 'Delete',
          onClick: () => deleteTemplate()
        }
        const editButtonConfig: ButtonConfig = {
          text: 'Create Invoice', onClick: () => {
            const templateData = { ...action.data.invoice, id: undefined } as Invoice;
            this.store.dispatch(InvoicesActions.setInvoiceFormData({ invoice: templateData, isEditing: false }));
            this.store.dispatch(closeDialogs());
            this.router.navigateByUrl('invoice/edit');
          }
        }
        const data: InvoiceDetailsDialogData = {
          invoice: action.data.invoice,
          primaryButton: editButtonConfig,
          declineButton: deleteButtonConfig
        }
        const dialogRef = this.dialog.open(InvoiceDetailsComponent, {
          data
        });
      })
    ), { dispatch: false })
  deleteEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TemplatesActions.deleteTemplate),
      switchMap((action) => {
        return this.invoiceService.deleteInvoice(action.id).pipe(
          map(_ => TemplatesActions.deleteSuccess({ id: action.id })),
          catchError(error => of(TemplatesActions.deleteFailure({error:error?.error?.errors ?? {}})))
        )
      })
    )
  })
  constructor(
    private actions$: Actions,
    private invoiceService: InvoiceService,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private router: Router) { }
}
