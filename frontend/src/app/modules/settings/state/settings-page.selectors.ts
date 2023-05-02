import {createFeatureSelector, createSelector} from "@ngrx/store";
import * as SettingsPageReducer from "./settings-page.reducer";
import {ProfileSettingsModel} from "../resources/models/profile-settings.model";

export const selectSettingsReducer = createFeatureSelector<SettingsPageReducer.State>(
  SettingsPageReducer.settingsPageKey
);

export const selectSettings = createSelector(
  selectSettingsReducer,
  state => state.userSettings
);

export const selectProfileSettings = createSelector(
  selectSettings,
  state => {
    if (state) {
      const profile: ProfileSettingsModel = {
        avatar: state?.avatar,
        name: state?.name,
        email: state.email,
      }

      return profile;
    }

    return null;
  }
)

export const selectPasswordErrors = createSelector(
  selectSettingsReducer,
  state => state.passwordErrors
)

export const isModalLoading = createSelector(
  selectSettingsReducer,
  state => state.isModalLoading
)
