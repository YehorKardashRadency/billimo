import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromRequestsBills from "./requests-bills.reducers"

const selectRequestsBills = createFeatureSelector<fromRequestsBills.State>(
  fromRequestsBills.requestsBillsFeatureKey
);

export const requestsBillsSelector = createSelector(
  selectRequestsBills,
  state  => state.requestsBills
);

export const selectRequestsBillssWithPaginator = createSelector(
  selectRequestsBills,
  state  => state.requestsBills
);

export const selectRequestsBillsTotalCount = createSelector(
  selectRequestsBillssWithPaginator,
  state => state?.totalCount ?? 0
);

export const requestsLoadingSelector = createSelector(
  selectRequestsBills,
  (state: fromRequestsBills.State): any => state.loading
);

export const requestsBillsLengthSelector = createSelector(
  selectRequestsBillssWithPaginator,
  state => state?.items.length
)

export const requestsBillsEmptySelector = createSelector(
  requestsBillsLengthSelector,
  state => state === 0
)

export const selectParams = createSelector(
  selectRequestsBills,
  state => state.params
);

export const selectPageSize = createSelector(
  selectParams,
  state => state.pageSize
);
