import { createAction, props } from "@ngrx/store";
import { LoginRequest } from "src/app/modules/auth/resources/models/LoginRequest";
import { LoginResult } from "src/app/modules/auth/resources/models/LoginResult";

export const loginPage = createAction(
  '[Login Component] Login User',
  props<{loginRequest:LoginRequest}>()
);

export const loginSuccess = createAction(
  '[Auth Effect] Login User Success',
  props<{ loginResult: LoginResult }>()
);

export const loginFailure = createAction(
  '[Auth Effect] Login User Failure',
  props<{ error: any }>()
);

export const logout = createAction('[Menu Component] Logout');

export const twoFactorCodeRequired = createAction(
  '[Auth Effect] Two Factor Code Required'
);

export const resendTwoFactorCode = createAction(
  '[Login Component] Resend Two Factor Code',
  props<{ loginRequest: LoginRequest }>()
)

export const resendTwoFactorCodeSuccess = createAction(
  '[Login Component] Resend Two Factor Code Success',
)

export const resendTwoFactorCodeFailure = createAction(
  '[Login Component] Resend Two Factor Code Failure',
  props<{ error: any }>()
)

export const backToLoginPage = createAction(
  '[Login Component] Back to Login Page',
)
