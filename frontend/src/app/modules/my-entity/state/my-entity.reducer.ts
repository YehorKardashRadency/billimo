import {  createReducer, on } from '@ngrx/store';

import * as MyEntityActions from './my-entity.actions';
import { IMyEntity } from '../resources/models/my-entity.model';

export const myEntityFeatureKey = 'myEntity';

export interface State {
  data: IMyEntity | null;
  error: any;
}

export const initialState: State = {
  data: null,
  error: null,
};

export const reducer = createReducer(
  initialState,
  on(MyEntityActions.loadMyEntitySuccess, (_state, action) => ({
      data: action.result,
      error: null
   })
  ),
  on(
    MyEntityActions.loadMyEntityFailure,
    (state, action) => ({
      ...state,
      error: action.error,
    })
  )
);
