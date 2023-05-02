import { createAction, props } from '@ngrx/store';
import { IMyEntity } from '../resources/models/my-entity.model';

export const loadMyEntity = createAction(
  '[MyEntity Component] Load MyEntity',
  props<{ id: string }>()
);

export const loadMyEntitySuccess = createAction(
  '[MyEntity Component] Load MyEntity Success',
  props<{ result: IMyEntity | null }>()
);
  
export const loadMyEntityFailure = createAction(
  '[MyEntity Component] Load MyEntity Failure',
  props<{ error: any }>()
);
