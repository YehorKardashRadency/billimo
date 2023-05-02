import { createReducer, on } from '@ngrx/store';
import { RequestsInvoicesActions } from '../actions/requests-invoices.actions';
import { InvoiceSorterService } from 'src/app/core/resources/services/invoice-sorter.service';
import { Invoice } from 'src/app/modules/invoices/resources/models/Invoice';
export interface State {
  currentInvoices: Invoice[],
  shownInvoices: Invoice[],
  error: any,
  loading: boolean
}
export const requestsInvoicesFeatureKey = 'requests-invoices'
export const initialState: State = {
  currentInvoices: [],
  error: null,
  shownInvoices: [],
  loading: true,
}

export const reducer = createReducer(
  initialState,
  
);


