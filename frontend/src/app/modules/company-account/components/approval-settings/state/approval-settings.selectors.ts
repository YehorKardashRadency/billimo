import {createSelector} from "@ngrx/store";
import {selectCompanyAccountState} from "../../../state/company-account.selector";
import {approvalSettingsKey} from "./approval-settings.reducer";

export const selectApprovalSettingsState = createSelector(
  selectCompanyAccountState,
  state => state[approvalSettingsKey]
)

export const selectApprovalSettings = createSelector(
  selectApprovalSettingsState,
  state =>state.settings
)
