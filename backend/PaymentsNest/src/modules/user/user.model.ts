export enum Role {
  Admin,
  Director,
  Manager,
  Empty,
}

export interface CurrentUser {
  id: number;
  role: Role;
  name: string;
  companyId: number;
  userAgent: string;
  ipAddress: string;
}
