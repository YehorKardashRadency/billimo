import { InvoiceSorterService } from 'src/app/core/resources/services/invoice-sorter.service';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromInvoices from '../reducers/invoices.reducers'
import { sortConfigSelector } from './invoices.selectors';
import sortInvoices from '../../utils/invoiceSorter';

const selectInvoices = createFeatureSelector<fromInvoices.State>(
    fromInvoices.invoicesFeatureKey
);
export const companyFilterSelector = createSelector(
    selectInvoices,
    (state) => {
        return state.archivedCompanyFilter
    }
)
export const archivedInvoicesSelector = createSelector(
    selectInvoices,
    (state) => {
        return state.archivedInvoices}
)
export const filteredByNameInvoicesSelector = createSelector(
    selectInvoices,
    (state) => state.archivedInvoices.filter(invoice => {
        const clearSearch = state.searchFilter.trim()
        if (clearSearch.length == 0) return true;
        return invoice.number.toString().includes(clearSearch)
    })
)
export const filteredByCompanyInvoicesSelector = createSelector(
    filteredByNameInvoicesSelector,
    companyFilterSelector,
    (invoices,companyFilter) => invoices
    .filter(invoice => {
        if (!companyFilter) return true;
        if (companyFilter == 'No company' && invoice.company == null) return true;
        if (typeof companyFilter == 'string') return invoice.company?.email != companyFilter;
        if (typeof companyFilter == 'number') return invoice.company?.id == companyFilter;
        console.error("Wrong filter. Value: ", companyFilter);
        return true
    })
)

export const shownArchivedInvoicesSelector = createSelector(
    filteredByCompanyInvoicesSelector,
    sortConfigSelector,
    (invoices, sortConfig) => sortInvoices(invoices, sortConfig.sortByProp, sortConfig.sortAscending)
)

export const exportedInvoicesSelector = createSelector(
    selectInvoices,
    (state) => state.exportedInvoices
)

export const archivedInvoicesEmptySelector = createSelector(
    selectInvoices,
    (state) => {
         return state.archivedInvoices.length === 0
    }
)

export const archivedLoadingSelector = createSelector(
    selectInvoices,
    (state) => {
         return state.archivedInvoicesLoading
    }
)
export const archivedInvoicesByCompanySelector = createSelector(
    archivedInvoicesSelector,
    (state) => {
        return InvoiceSorterService.groupByCompany(state)
    }
)
export const selectArchivedInvoice = (id: number) => createSelector(
    archivedInvoicesSelector,
    (invoices) => invoices.find(invoice => invoice.id == id)
)
