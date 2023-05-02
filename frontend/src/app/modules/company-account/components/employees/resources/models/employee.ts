import {Role} from "../../../../../auth/resources/models/Role";

export interface Employee{
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  companyName: string;
  invited: boolean;
}

