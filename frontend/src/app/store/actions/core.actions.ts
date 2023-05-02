import { createAction, props } from "@ngrx/store";
import { User } from "src/app/modules/auth/resources/models/User";

export const coreGetCurrentUserInfo = createAction(
  '[Shell Component] Get Current User Info',
);

export const coreGetCurrentUserInfoSuccess = createAction(
  '[Shell Component] Get Current User Info Success',
  props<{ user: User}>()
);

export const coreGetCurrentUserInfoFailure = createAction(
  '[Auth Effect] Get Current User Info Failure',
  props<{ error: any }>()
);
