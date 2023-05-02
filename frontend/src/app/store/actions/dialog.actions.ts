import { createAction, props } from "@ngrx/store";
import { Address } from "src/app/modules/company-account/components/employees/resources/models/Address";

export const openExampleSuccessDialog = createAction('[Dialog Component] Opened dialog');

export const openExampleConfirmationDialog = createAction('[Dialog Component] Opened example confirmation dialog')
export const openTermsAndConditionsDialog = createAction('[Dialog Component] Opened terms and conditions dialog')
export const openSuccessfullAddressAddedDialog = createAction('[Dialog Component] Opened address added dialog')
export const openAddressEditDialog = createAction('[Dialog Component] Opened address editing dalog',
  props<{ address: Address, defaultAddressId?: number }>())
export const closeDialogs = createAction('[Dialog Component] Closed dialog');

export const openAddUserDialog = createAction('[Dialog Component] Open add user dialog');
