import {Role} from "./Role";

export interface User {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: Role | null;
  companyId: number | null;
  companyName:string | null;
  avatar: string | null;
}
