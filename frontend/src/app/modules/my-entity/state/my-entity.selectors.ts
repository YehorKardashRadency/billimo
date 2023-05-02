import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as MyEntityReducer from './my-entity.reducer';

export const selectMyEntityState = createFeatureSelector<MyEntityReducer.State>(
  MyEntityReducer.myEntityFeatureKey    
);

export const selectData = createSelector(
  selectMyEntityState,
  state => state.data
);

export const selectDetail = createSelector(
  selectData,
  data => data?.detail
);
