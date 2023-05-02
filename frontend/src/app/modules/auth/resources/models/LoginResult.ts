export interface LoginResult {
    token: string;
    refreshToken: string;
    succeeded: boolean;
    twoFactorCodeRequired: boolean;
    errors: string[];
}
