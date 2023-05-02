import { selectEmployees } from './../../../../company-account/components/employees/state/employee.selectors';
import { CompanyModel } from './../../../../../shared/models/CompanyModel';
import {createReducer, on} from '@ngrx/store';
import {InvoicesActions} from '../actions/invoices.actions';
import {Invoice} from 'src/app/modules/invoices/resources/models/Invoice';
import {ArchivedInvoicesActions} from '../actions/archived-invoices.actions';
import {GetInvoiceNumber} from "../../models/GetInvoiceNumber";
import * as invoiceActions from "../actions/invoice.actions";

import { editInvoiceSuccess } from '../actions/invoice.actions';
import { InvoiceFormData } from '../../models/InvoiceFormData';
import { getRegularInvoicesSuccess } from '../actions/regular-invoices.actions';
export interface State {
    invoices: Invoice[],
    archivedInvoices: Invoice[],
    exportedInvoices: Invoice[],
    invoicesLoading: boolean,
    regularInvoices:Invoice[],
    archivedInvoicesLoading: boolean,
    companyFilter?: number | string,
    archivedCompanyFilter?: number | string,
    searchFilter: string;
    error: any,
    sortByProp?: string,
    sortAscending: boolean,
    invoiceFormData?: InvoiceFormData,
    selectedCompany: CompanyModel | null,
    invoiceNumber: GetInvoiceNumber | null,
}

export const invoicesFeatureKey = 'invoices'
export const initialState: State = {
    invoices: [],
    archivedInvoices: [],
    exportedInvoices: [],
    searchFilter: '',
    error: null,
    invoicesLoading: true,
    archivedInvoicesLoading: true,
    sortAscending: true,
    invoiceNumber: null,
    selectedCompany:null,
    regularInvoices:[],
}

export const reducer = createReducer(
  initialState,
  on(InvoicesActions.setSearchFilter, (state, action) => {
    return {
      ...state,
      searchFilter: action.query
    };
  }),
  on(InvoicesActions.setLoading, (state, action) => {
    return {
      ...state,
      invoicesLoading: action.loading
    };
  }),
  on(InvoicesActions.getInvoicesSuccess, (state, action) => {
    console.log("INVOICES", action.invoices)
    return {
      ...state,
      invoices: action.invoices,
      shownInvoices: action.invoices,
      invoicesLoading: false,
      error: null,
    };
  }),
  on(InvoicesActions.getInvoicesFailure, (state, action) => {
    return {
      ...state,
      invoices: [],
      error: action.error,
    };
  }),
  on(InvoicesActions.setCompanyFilter, (state, action) => {
    return {
      ...state,
      companyFilter: action.filter
    }
  }),
  on(InvoicesActions.deleteSuccess, (state, action) => {
    return {
      ...state,
      invoices: state.invoices.filter(x => x.id != action.invoiceId),
      error: null,
    }
  }),
  on(InvoicesActions.toggleSortOrder, (state, action) => {
    return {
      ...state,
      sortAscending: !state.sortAscending
    }
  }),
  on(InvoicesActions.setSortProp, (state, action) => {
    return {
      ...state,
      sortByProp: action.prop,
      sortAscending: false,
    }
  }),
  on(ArchivedInvoicesActions.setCompanyFilter, (state, action) => {
    return {
      ...state,
      archivedCompanyFilter: action.filter
    }
  }),
  on(ArchivedInvoicesActions.setLoading, (state, action) => {
    return {
      ...state,
      archivedInvoicesLoading: action.loading
    }
  }),
  on(ArchivedInvoicesActions.getArchivedInvoicesSucess, (state, action) => {
    return {
      ...state,
      error: null,
      archivedInvoicesLoading: false,
      archivedInvoices: action.invoices,
    }
  }),
  on(ArchivedInvoicesActions.getArhivedInvoicesFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
      archivedInvoices: [],
      exportedInvoices: [],
      shownArchivedInvoices: [],
    }
  }),
  on(ArchivedInvoicesActions.addToExportedInvoices, (state, action) => {
    let exported = [...state.exportedInvoices];
    exported.push(action.exportedInvoice);
    return {
      ...state,
      exportedInvoices: exported,
    }
  }),
  on(ArchivedInvoicesActions.removeFromExportedInvoices, (state, action) => {
    let exported: Invoice[] = [...state.exportedInvoices];
    const indexToRemove = exported.findIndex(x => x.id === action.excludedInvoice.id);
    exported.splice(indexToRemove, 1);
    return {
      ...state,
      exportedInvoices: exported,
    }
  }),
  on(ArchivedInvoicesActions.addInvoicesToExported, (state, action) => {
    return {
      ...state,
      exportedInvoices: action.exportedInvoices,
    }
  }),
  on(ArchivedInvoicesActions.removeAllInvoicesFromExported, (state) => {
    return {
      ...state,
      exportedInvoices: [],
    }
  }),
  on(invoiceActions.getInvoiceNumberSuccess, (state, action) => {
    return {
      ...state,
      invoiceNumber: action.invoiceNumber,
      error: null,
    }
  }),
    on(InvoicesActions.setInvoiceFormData, (state,{invoice,isEditing}) => {
        return {
            ...state,
            invoiceFormData:{invoice,isEditing},
        }
    }),
    on(InvoicesActions.buyerCompanySelectionChanged, (state,action) => {
        return {
            ...state,
            selectedCompany: action.selectedCompany,
        }
    }),
    on(editInvoiceSuccess, (state,action) => {
        let invoices:Invoice[] = [...state.invoices];
        const invoiceToSaveIndex = invoices.findIndex(x => x.id === action.invoiceToSave.id);
        invoices[invoiceToSaveIndex].notes = action.invoiceToSave.notes;
        return {
            ...state,
            invoices: invoices,
            invoiceFormData: undefined,
            selectedCompany:null,
        }
    }),
    on(getRegularInvoicesSuccess, (state,action) => {
        return {
            ...state,
            regularInvoices:action.invoices,
        }
    }),
);
