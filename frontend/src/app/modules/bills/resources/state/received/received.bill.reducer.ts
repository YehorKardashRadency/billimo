import { createReducer, on } from '@ngrx/store';
import { QueryParams } from 'src/app/core/resources/models/QueryParams';
import { SortDirection } from 'src/app/core/resources/models/SortDirection';
import { PaginatedList } from 'src/app/shared/models/PaginatedList';
import { Bill } from '../../models/bill.model';
import {ReceivedBill} from '../../models/received.bill';
import * as BillActions from './received.bill.actions';

export const billsFeatureKey = 'receivedBills';

export interface State {
  selectedBill: Bill | null,
  bills: PaginatedList<ReceivedBill> | null;
  error: string | null;
  params: QueryParams;
  selectedBillId:number;
}

export const initialState: State = {
  selectedBill: null,
  bills: null,
  error: null,
  selectedBillId:0,
  params: {
    filter: [],
    search: null,
    sort: [{ field: 'date', direction: SortDirection.descending }],
    pageIndex:0,
    pageSize:6
  },
};

export const reducer = createReducer(
  initialState,
  on(BillActions.loadReceivedBills, (state, action) => {
    return {
      ...state,
      bills:null
    };
  }),

  on(BillActions.loadReceivedBillsSuccess, (state, action) => {
    return {
      ...state,
      selectedBillId:0,
      bills:action.bills,
      error:null
    };
  }),

  on(BillActions.loadReceivedBillsFailure, (state, action) => {
    return {
      ...state,
      bills:null,
      error:action.error
    };
  }),

  on(BillActions.setFilterReceivedBills, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        filter:action.filter,
        pageIndex:0
      }
    };
  }),

  on(BillActions.setSortReceivedBills, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        sort:action.sort,
        pageIndex:0
      }
    };
  }),

  on(BillActions.searchReceivedBills, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        search:action.search
      }
    };
  }),
  on(BillActions.setPageIndexReceivedBills, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        pageIndex:action.pageIndex
      }
    };
  }),
  on(BillActions.setPageSizeReceivedBills, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        pageSize:action.pageSize
      }
    };
  }),
  on(BillActions.clearReceivedBills, (state, action) => {
    return initialState
  }),
  on(BillActions.clearReceivedBillsFilter, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        filter:[]
      }
    };
  }),
  on(BillActions.clearReceivedBillsSort, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        sort:[{ field: 'date', direction: SortDirection.descending }]
      }
    };
  }),
  on(BillActions.setSelectedReceivedBillId, (state, action) => {
    return {
      ...state,
      selectedBillId:action.id
    };
  })
  
);
