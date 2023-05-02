import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../../../../core/resources/services/api.service';
import { Employee } from '../models/employee';
import { RegisterEmployee } from '../models/registerEmployee';
import { FinishEmployeeRegistration } from '../models/finishEmployeeRegistration';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  getAllEmployees(companyId: number) {
    return this.get<Employee[]>('/gateway/employees/company/' + companyId);
  }

  updateEmployeeRole(id: number, role: number) {
    return this.put(`/gateway/employee/${id}/role`, role);
  }

  resendEmployeeEmail(id: number) {
    return this.put(`/gateway/employee/${id}/resend-email`);
  }

  addEmployee(employee: RegisterEmployee) {
    return this.post<any>('/gateway/user', employee);
  }

  getEmployeeDetails(id: number) {
    return this.get<Employee>(`/gateway/user/${id}`);
  }

  finishEmployeeRegistration(id: number, data: FinishEmployeeRegistration) {
    return this.put(`/gateway/user/${id}/finish-registration`, data);
  }
}
