import { createReducer, on } from "@ngrx/store";
import { QueryParams } from "src/app/core/resources/models/QueryParams";
import { SortDirection } from "src/app/core/resources/models/SortDirection";
import { PaginatedList } from "src/app/shared/models/PaginatedList";
import { Bill } from "../../models/bill";
import { RequestsBillsActions } from "./requests-bills.actions"

export interface State {
  requestsBills: PaginatedList<Bill> | null,
  error: any,
  loading: boolean,
  params: QueryParams
}

export const requestsBillsFeatureKey = 'requests-bills'

export const initialState: State = {
  requestsBills: null,
  error: null,
  loading: true,
  params: {
    filter: [],
    search: null,
    sort: [{ field: 'date', direction: SortDirection.descending }],
    pageIndex:0,
    pageSize:4
  },
}

export const reducer = createReducer(
  initialState,
  on(RequestsBillsActions.loadRequestsBillsSuccess, (state, action) => {
    return {
      ...state,
      requestsBills: action.requestsBills,
      loading: false,
      error: null,
    };
  }),
  on(RequestsBillsActions.loadRequestsBillsFailure, (state, action) => {
    return {
      ...state,
      requestsBills: null,
      error: action.error,
    };
  }),
  on(RequestsBillsActions.setSortRequestsBills, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        sort:action.sort,
        pageIndex:0
      }
    };
  }),
  on(RequestsBillsActions.clearRequestsBillsSort, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        sort:[{ field: 'date', direction: SortDirection.descending }]
      }
    };
  }),
  on(RequestsBillsActions.setPageIndexRequestsBills, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        pageIndex:action.pageIndex
      }
    };
  }),
  on(RequestsBillsActions.searchRequestsBills, (state, action) => {
    return {
      ...state,
      params: {
        ...state.params,
        search:action.search
      }
    };
  }),
  on(RequestsBillsActions.createBillRequestFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    };
  }),
);
