import { createReducer, on } from '@ngrx/store';
import { QueryParams } from 'src/app/core/resources/models/QueryParams';
import { SortDirection } from 'src/app/core/resources/models/SortDirection';
import { PaginatedList } from 'src/app/shared/models/PaginatedList';

import { Bill } from '../../models/bill.model';
import  * as BillList from '../../models/bill';
import * as BillActions from './bill.actions';

export const billsFeatureKey = 'bills';

export interface State {
  selectedBill: Bill | null;
  bills: PaginatedList<BillList.Bill> | null;
  error: string | null;
  params: QueryParams;
  selectedAll:boolean;
  selectedBills:number[];

  isModalLoading: boolean;
}

export const initialState: State = {
  selectedBill: null,
  bills: null,
  error: null,
  selectedAll:false,
  selectedBills:[],
  params: {
    filter: [],
    search: null,
    sort: [{ field: 'date', direction: SortDirection.descending }],
    pageIndex:0,
    pageSize:6
  },

  isModalLoading: false,
};

export const reducer = createReducer(
  initialState,
  on(BillActions.loadBillPaymentDetailsSuccess, (state, action) => {
    return {
      ...state,
      selectedBill: action.bill,
      error: null
    }
  }),
  on(BillActions.loadBillPaymentDetailsFailure, (state, action) => {
    return {
      ...state,
      selectedBill: null,
      error: action.error
    }
  }),
  on(BillActions.loadSentBills, (state, action) => {
    return {
      ...state,
      bills:null
    };
  }),
  on(BillActions.loadSentBillsSuccess, (state, action) => {
    return {
      ...state,
      bills:action.bills,
      error:null
    };
  }),
  on(BillActions.loadSentBillsFailure, (state, action) => {
    return {
      ...state,
      bills:null,
      error:action.error
    };
  }),

  on(BillActions.setFilterSentBills, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        filter:action.filter,
        pageIndex:0
      }
    };
  }),

  on(BillActions.setSortSentBills, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        sort:action.sort,
        pageIndex:0
      }
    };
  }),

  on(BillActions.searchSentBills, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        search:action.search
      }
    };
  }),
  on(BillActions.setPageIndexSentBills, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        pageIndex:action.pageIndex
      }
    };
  }),
  on(BillActions.setPageSizeSentBills, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        pageSize:action.pageSize
      }
    };
  }),
  on(BillActions.clearSentBills, (state, action) => {
    return initialState
  }),
  on(BillActions.clearSentBillsFilter, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        filter:[]
      }
    };
  }),
  on(BillActions.clearSentBillsSort, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        sort:[{ field: 'date', direction: SortDirection.descending }]
      }
    };
  }),
  on(BillActions.selectedAllSentBills, (state, action) => {
    return {
      ...state,
      selectedAll: !state.selectedAll,//action.selectedAll,
      selectedBills: !state.selectedAll === false ? [] :  state.selectedBills
    };
  }),
  on(BillActions.setSelectedSendBills, (state, action) => {
    return {
      ...state,
      selectedBills:action.selectedBills
    };
  }),
  on(BillActions.cancelBill, (state, action) => {
  return {
    ...state,
    isModalLoading: true,
    };
  }),
  on(BillActions.cancelBillSuccess, (state, action) => {
    return {
      ...state,
      isModalLoading: false,
    };
  }),
  on(BillActions.cancelBillFailed, (state, action) => {
    return {
      ...state,
      isModalLoading: false,
    };
  }),
);
