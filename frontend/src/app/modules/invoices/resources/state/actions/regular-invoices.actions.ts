import { Invoice } from 'src/app/modules/invoices/resources/models/Invoice';
import { createAction, props } from "@ngrx/store";




export const getRegularIncoices  = createAction(
    '[Regular component] get regular invoices'
)

export const getRegularInvoicesSuccess = createAction(
    '[Regular component] get regular invoices success',
    props<{invoices:Invoice[]}>(),
)