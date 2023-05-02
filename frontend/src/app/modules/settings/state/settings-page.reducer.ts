import {createReducer, on} from '@ngrx/store';
import * as SettingsActions from "./settings-page.actions";
import {UserSettingsModel} from "../resources/models/user-settings.model";

export const settingsPageKey = 'settingsPage';

export interface State {
  userSettings: UserSettingsModel | null;
  error: any;

  isModalLoading: boolean,
  passwordErrors: string[],
}

export const initialState: State = {
  userSettings: null,
  error: null,

  isModalLoading: false,
  passwordErrors: [],
};

export const reducer = createReducer(
  initialState,

  on(SettingsActions.loadUserSettings, (state, action) => ({
      ...state,
      error: null,
    })
  ),

  on(SettingsActions.loadUserSettingsSuccess, (state, action) => ({
      ...state,
      userSettings: action.settings,
      error: null,
    })
  ),

  on(SettingsActions.loadUserSettingsFailed, (state, action) => ({
      ...state,
      error: action.error,
    })
  ),

  on(SettingsActions.updateProfileSettings, (state, action) => ({
      ...state,
      isModalLoading: true,
      error: null,
    })
  ),

  on(SettingsActions.updateProfileSettingsSuccess, (state, action) => ({
      ...state,
      userSettings: {
        ...state.userSettings!,
        avatar: action.settings.avatar,
        name: action.settings.name,
      },
      isModalLoading: false,
      error: null,
    })
  ),

  on(SettingsActions.updateProfileSettingsFailed, (state, action) => ({
      ...state,
      isModalLoading: false,
      error: action.error,
    })
  ),

  on(SettingsActions.updatePasswordSettings, (state, action) => ({
      ...state,
      isModalLoading: true,
    })
  ),

  on(SettingsActions.updatePasswordSettingsFailed, (state, action) => ({
      ...state,
      isModalLoading: false,
      passwordErrors: action.errors,
    })
  ),

  on(SettingsActions.updatePasswordSettingsSuccess, (state, action) => ({
      ...state,
    isModalLoading: false,
    passwordErrors: [],
    })
  ),

  on(SettingsActions.closePasswordSettingsModal, (state, action) => ({
    ...state,
    passwordErrors: [],
    })
  ),
);
