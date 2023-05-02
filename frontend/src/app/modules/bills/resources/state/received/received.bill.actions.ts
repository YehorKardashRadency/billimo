import { createAction, props } from "@ngrx/store";
import { Filter } from "src/app/core/resources/models/Filter";
import { Sort } from "src/app/core/resources/models/Sort";
import { PaginatedList } from "src/app/shared/models/PaginatedList";
import { ReceivedBill } from '../../models/received.bill';

export const loadReceivedBills = createAction(
  '[Received Bills] Load'
);

export const loadReceivedBillsSuccess = createAction(
  '[Received Bills] Load Success',
  props<{ bills: PaginatedList<ReceivedBill> }>()
);

export const loadReceivedBillsFailure = createAction(
  '[Received Bills] Load Failure',
  props<{ error: any }>()
);

export const addFilterReceivedBills = createAction(
  '[Received Bills] Filter Add',
  props<{ filter: Filter }>()
);

export const removeFilterReceivedBills = createAction(
  '[Received Bills] Filter Remove',
  props<{ key: string }>()
);

export const setFilterReceivedBills = createAction(
  '[Received Bills] Filter Set',
  props<{ filter: Filter[] }>()
);

export const setSortReceivedBills = createAction(
  '[Received Bills] Sort',
  props<{ sort: Sort[] }>()
);

export const searchReceivedBills = createAction(
  '[Received Bills] Search',
  props<{ search: string | null }>()
);

export const setPageIndexReceivedBills = createAction(
  '[Received Bills] Page index',
  props<{ pageIndex: number }>()
);

export const setPageSizeReceivedBills = createAction(
  '[Received Bills] Page size',
  props<{ pageSize: number }>()
);

export const clearReceivedBills = createAction(
  '[Received Bills] Clear state'
);

export const clearReceivedBillsFilter = createAction(
  '[Received Bills] Clear filter',
);

export const clearReceivedBillsSort = createAction(
  '[Received Bills] Clear sort',
);

export const setSelectedReceivedBillId = createAction(
  '[Received Bills] Set selected bill id',
  props<{ id: number }>()
);

export const paySelectedReceivedBill = createAction(
  '[Received Bills] Pay received bill',
);

export const redirectToPayReceivedBillPage = createAction(
  '[Received Bills] Redirect to pay received bill',
  props<{ route: string }>()
);
