import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as BillsReducer from './received.bill.reducer';

export const selectBillsState = createFeatureSelector<BillsReducer.State>(
  BillsReducer.billsFeatureKey
);

export const getSelectedBill = createSelector(
  selectBillsState,
  state => state.selectedBill
)

export const getAllBills = createSelector(
  selectBillsState,
  state => state.bills
)

export const selectParams = createSelector(
  selectBillsState,
  state => state.params
);

export const selectReceivedBillsWithPaginator = createSelector(
  selectBillsState,
  state => state.bills
);

export const selectReceivedBills = createSelector(
  selectReceivedBillsWithPaginator,
  state => state?.items
);

export const selectReceivedBillsId = createSelector(
  selectReceivedBills,
  state => state?.map(x => x.id) ?? []
);

export const selectReceivedBillsTotalCount = createSelector(
  selectReceivedBillsWithPaginator,
  state => state?.totalCount ?? 0
);

export const selectSelectedReceivedBillId = createSelector(
  selectBillsState,
  state => state.selectedBillId
);

export const selectPageSize = createSelector(
  selectParams,
  state => state.pageSize
);
