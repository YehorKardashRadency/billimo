import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as BillsReducer from './bill.reducer';

export const selectBillsState = createFeatureSelector<BillsReducer.State>(
  BillsReducer.billsFeatureKey
);

export const getSelectedBill = createSelector(
  selectBillsState,
  state => state.selectedBill
)

export const getSelectedBillNumber = createSelector(
  getSelectedBill,
  state => state?.invoice.number
)

export const getAllBills = createSelector(
  selectBillsState,
  state => state.bills
)

export const selectParams = createSelector(
  selectBillsState,
  state => state.params
);

export const selectSentBillsWithPaginator = createSelector(
  selectBillsState,
  state => state.bills
);

export const selectSentBills = createSelector(
  selectSentBillsWithPaginator,
  state => state?.items
);

export const selectSentBillsId = createSelector(
  selectSentBills,
  state => state?.map(x => x.id) ?? []
);

export const selectSentBillsTotalCount = createSelector(
  selectSentBillsWithPaginator,
  state => state?.totalCount ?? 0
);

export const selectSelectedAllSentBills = createSelector(
  selectBillsState,
  state => state.selectedAll
);

export const selectSelectedSentBillsId = createSelector(
  selectBillsState,
  state => state.selectedBills
);

export const selectSelectedSentBills = createSelector(
  selectBillsState,
  state => state.bills?.items.filter(x => state.selectedBills.includes(x.id)) ?? []
);

export const selectPageSize = createSelector(
  selectParams,
  state => state.pageSize
);

export const selectModalLoading = createSelector(
  selectBillsState,
  state => state.isModalLoading,
)
