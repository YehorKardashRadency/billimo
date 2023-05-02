export interface UserSettingsModel {
  avatar: string | null,
  name: string,
  email: string,

  notificationsEnabled: boolean,
  twoFactorEnabled: boolean
}
