import { createReducer, on } from '@ngrx/store';
import * as fromCreatInvoiceActions from '../actions/invoice.actions';


export interface State {
  invoice: any | null;
  error: any;

}

export const initialState: State = {
  invoice: null,
  error: null,

};

export const reducer = createReducer(
  initialState,

  on(fromCreatInvoiceActions.createInvoiceSuccess, (state, action) => {
    return {
      ...state,
      invoice: action.invoice,
      error: null,
    };
  }),
  on(fromCreatInvoiceActions.createInvoiceFailure, (state, action) => {
    return {
      ...state,
      invoice: null,
      error: action.error,
    };
  }),

);
