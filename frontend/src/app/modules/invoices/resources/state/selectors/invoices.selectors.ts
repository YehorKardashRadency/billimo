import { InvoiceSorterService } from 'src/app/core/resources/services/invoice-sorter.service';
import { createFeatureSelector } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
import * as fromInvoices from '../reducers/invoices.reducers'
import { Invoice } from 'src/app/modules/invoices/resources/models/Invoice';
import { ApprovalStatus } from 'src/app/shared/models/ApprovalStatus';
import sortInvoices from '../../utils/invoiceSorter';

const selectInvoices = createFeatureSelector<fromInvoices.State>(
    fromInvoices.invoicesFeatureKey
);

export const invoiceFormDataSelector = createSelector(
    selectInvoices,
    (state) => state.invoiceFormData
)

export const companyFilterSelector = createSelector(
    selectInvoices,
    (state) => state.companyFilter
)
export const sortConfigSelector = createSelector(
    selectInvoices,
    ({sortAscending,sortByProp}) =>{return {sortAscending,sortByProp}}
)

export const filteredByNumberInvoicesSelector = createSelector(
    selectInvoices,
    (state) => state.invoices.filter(invoice => {
        const clearSearch = state.searchFilter.trim()
        if (clearSearch.length == 0) return true;
        return ("INV-" + invoice.number).includes(clearSearch)
    })
)
export const filteredByCompanyInvoicesSelector = createSelector(
    filteredByNumberInvoicesSelector,
    companyFilterSelector,
    (invoices, companyFilter) => invoices
        .filter(invoice => {
            if (companyFilter== undefined) return true;
            if (companyFilter == 'No company' ) {
                return invoice.company == null;
            }
            if (typeof companyFilter == 'string') return invoice.company?.email != companyFilter;
            if (typeof companyFilter == 'number') return invoice.company?.id == companyFilter;
            console.error("Wrong filter. Value: ", companyFilter);
            return false;
        })
)
export const shownInvoicesSelector = createSelector(
    filteredByCompanyInvoicesSelector,
    sortConfigSelector,
    (invoices, sortConfig) => sortInvoices(invoices, sortConfig.sortByProp, sortConfig.sortAscending)
)


export const currentInvoicesSelector = createSelector(
    selectInvoices,
    (state: fromInvoices.State) => {
        return state.invoices
    }
);
export const archivedInvoicesSelector = createSelector(
    selectInvoices,
    (state: fromInvoices.State) => {
        return state.archivedInvoices
    }
);
export const requestsInvoicesSelector = createSelector(
    selectInvoices,
    (state: fromInvoices.State) => {
        return state.invoices.filter(invoice => invoice.approvalStatus == ApprovalStatus.Pending);
    }
);
export const shownRequestsInvoicesSelector = createSelector(
    shownInvoicesSelector,
    (state: Invoice[]) => {
        {
            return state.filter(invoice => invoice.approvalStatus == ApprovalStatus.Pending);
        }
    }
);
export const currentInvoicesLoadingSelector = createSelector(
    selectInvoices,
    (state: fromInvoices.State) => { return state.invoicesLoading }
)

export const currentInvoicesLengthSelector = createSelector(
    currentInvoicesSelector,
    (state: Invoice[]) => {
        return state.length
    }
)
export const requestsInvoicesLengthSelector = createSelector(
    requestsInvoicesSelector,
    (state: Invoice[]) => {
        return state.length
    }
)

export const currentInvoicesByCompanySelector = createSelector(
    currentInvoicesSelector,
    (state) => InvoiceSorterService.groupByCompany(state)
)

export const currentInvoicesEmptySelector = createSelector(
    currentInvoicesLengthSelector,
    (state: number) => state === 0
)

export const selectInvoice = (id: number) => createSelector(
    currentInvoicesSelector,
    (invoices) => invoices.find(invoice => invoice.id == id)
)

export const selectInvoiceNumber= createSelector(
    selectInvoices,
    (state) => state.invoiceNumber
)

export const selectedBuyerCompanySelector = createSelector(
    selectInvoices,
    (state) => state.selectedCompany
)

export const regularInvoicesSelector = createSelector(
    selectInvoices,
    (state) => state.regularInvoices
)

export const regularInvoicesEmptySelector = createSelector(
    selectInvoices,
    (state) => state.regularInvoices.length === 0
)

export const regularInvoicesLengthSelector = createSelector(
    selectInvoices,
    (state) => state.regularInvoices.length
  )