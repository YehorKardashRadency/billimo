import {createAction, props} from "@ngrx/store";
import {UserSettingsModel} from "../resources/models/user-settings.model";
import {EmailSettingsModel} from "../resources/models/email-settings.model";
import {ProfileSettingsModel} from "../resources/models/profile-settings.model";
import {PasswordSettingsModel} from "../resources/models/password-settings.model";

export const loadUserSettings = createAction(
  '[Settings Page Component] Load Settings'
);

export const loadUserSettingsSuccess = createAction(
  '[Settings Effects] Load Settings Success',
  props<{ settings: UserSettingsModel }>()
);

export const loadUserSettingsFailed = createAction(
  '[Settings Effects] Load Settings Failed',
  props<{ error: any }>()
);

export const updateEmailSettings = createAction(
  '[Email Settings Component] Update Email Settings',
  props<{ settings: EmailSettingsModel }>()
);

export const updateEmailSettingsSuccess = createAction(
  '[Settings Effects] Update Email Settings Success',
);

export const updateEmailSettingsFailed = createAction(
  '[Settings Effects] Update Email Settings Failed',
  props<{ error: any }>()
);

export const openEditProfileModal = createAction(
  '[Profile Settings Component] Open Edit Profile Modal',
);

export const closeEditProfileModal = createAction(
  '[Profile Settings Component] Close Edit Profile Modal',
);

export const updateProfileSettings = createAction(
  '[Profile Settings Component] Update Profile Settings',
  props<{ settings: ProfileSettingsModel  }>()
);

export const updateProfileSettingsSuccess = createAction(
  '[Settings Effects] Update Profile Settings Success',
  props<{ settings: ProfileSettingsModel  }>()
);

export const updateProfileSettingsFailed = createAction(
  '[Settings Effects] Update Profile Settings Failed',
  props<{ error: any }>()
);

export const openChangeSettingsModal = createAction(
  '[Profile Settings Component] Open Change Settings Modal',
);

export const closePasswordSettingsModal = createAction(
  '[Profile Settings Component] Close Change Settings Modal',
)

export const updatePasswordSettings = createAction(
  '[Profile Settings Component] Update Password Settings',
  props<{ settings: PasswordSettingsModel  }>()
);

export const updatePasswordSettingsSuccess = createAction(
  '[Settings Effects] Update Password Settings Success',
);

export const updatePasswordSettingsFailed = createAction(
  '[Settings Effects] Update Password Settings Failed',
  props<{ errors: string[] }>()
);

