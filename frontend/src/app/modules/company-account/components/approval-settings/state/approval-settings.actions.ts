import {createAction, props} from "@ngrx/store";
import {ApprovalSettingsModel} from "../resources/models/approval-settings.model";

export const loadApprovalSettings = createAction(
  '[Approval Settings Component] Load Approval Settings'
);

export const loadApprovalSettingsSuccess = createAction(
  '[Approval Settings Effects] Load Approval Settings Success',
  props<{ result: ApprovalSettingsModel | null }>()
);

export const loadApprovalSettingsFailed = createAction(
  '[Approval Settings Effects] Load Approval Settings Failed',
  props<{ error: any }>()
);

export const updateApprovalSettings = createAction(
  '[Approval Settings Component] Update Approval Settings',
  props<{ model: ApprovalSettingsModel}>()
);

export const updateApprovalSettingsSuccess = createAction(
  '[Approval Settings Effects] Update Approval Success'
);

export const updateApprovalSettingsFailed = createAction(
  '[Approval Settings Effects] Update Approval Failed',
  props<{ error: any }>()
);

