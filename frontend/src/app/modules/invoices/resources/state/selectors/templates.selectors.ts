import { createFeatureSelector, createSelector } from "@ngrx/store";
import { InvoiceSorterService } from "src/app/core/resources/services/invoice-sorter.service";
import { ApprovalStatus } from "src/app/shared/models/ApprovalStatus";
import { Invoice } from "../../models/Invoice";
import sortInvoices from "../../utils/invoiceSorter";
import * as fromTemplates from '../reducers/templates.reducer';


const selectTemplates = createFeatureSelector<fromTemplates.State>(
  fromTemplates.templatesFeatureKey
);

export const templatesSelector = createSelector(
  selectTemplates,
  (state) => {
      return state.templates
  }
);
export const templatesLoadingSelector = createSelector(
  selectTemplates,
  (state) => { return state.templatesLoading }
)

export const templatesLengthSelector = createSelector(
  templatesSelector,
  (state: Invoice[]) => {
      return state.length
  }
)


export const templatesEmptySelector = createSelector(
  templatesLengthSelector,
  (state: number) => state === 0
)
