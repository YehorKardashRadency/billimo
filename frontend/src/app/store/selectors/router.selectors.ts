import { routerKey } from './../index';
import {createFeatureSelector, createSelector} from "@ngrx/store";
import * as fromRouter from "@ngrx/router-store";

export const selectRouterEntity = createFeatureSelector<fromRouter.RouterReducerState>(
  routerKey
);

export const selectCurrentPage=createSelector(
  selectRouterEntity,
  (state)=>state.state?.url?.split("/").pop()
);
