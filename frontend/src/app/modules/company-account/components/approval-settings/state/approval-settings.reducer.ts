import {createReducer, on} from "@ngrx/store";
import * as ApprovalSettingsActions from "../state/approval-settings.actions";
import {ApprovalSettingsModel} from "../resources/models/approval-settings.model";

export const approvalSettingsKey = 'approvalSettingsKey';

export interface ApprovalSettingsState {
  settings: ApprovalSettingsModel | null;
  error: any;
}

export const initialState: ApprovalSettingsState = {
  settings: null,
  error: null,
};

export const reducer = createReducer(
  initialState,

  on(ApprovalSettingsActions.loadApprovalSettings, (state, action) => ({
      ...state,
      error: null,
    })
  ),

  on(ApprovalSettingsActions.loadApprovalSettingsSuccess, (state, action) => ({
      ...state,
      settings: action.result,
      error: null,
    })
  ),

  on(ApprovalSettingsActions.loadApprovalSettingsFailed, (state, action) => ({
      ...state,
      error: action.error,
    })
  ),

  on(ApprovalSettingsActions.updateApprovalSettingsFailed, (state, action) => ({
      ...state,
      error: action.error,
    })
  ),
);
