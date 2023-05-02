import { getRegularIncoices as getRegularInvoices, getRegularInvoicesSuccess } from './../actions/regular-invoices.actions';
import { InvoiceService } from 'src/app/modules/invoices/resources/services/invoice.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Inject, Injectable } from "@angular/core";
import { createAction } from '@ngrx/store';
import { map, mergeMap } from 'rxjs';


@Injectable()
export class RegularInvoicesEffects{
    constructor(private actions: Actions, private invoiceService: InvoiceService)
    {}

    getRegularInvoices$ = createEffect(() => 
    this.actions.pipe(
        ofType(getRegularInvoices),
        mergeMap(action => 
             this.invoiceService.getRegularInvoices().pipe(
                map(result => getRegularInvoicesSuccess({invoices:result})),
             )
        )
    )
    )
}