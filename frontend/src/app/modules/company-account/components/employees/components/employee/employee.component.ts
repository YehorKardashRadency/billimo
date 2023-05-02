import { Component, Input, OnInit } from '@angular/core';
import { Role } from 'src/app/modules/auth/resources/models/Role';
import { Employee } from '../../resources/models/employee';
import { getValueEnum } from '../../../../../../core/helper/enumHelper';
import { Store } from '@ngrx/store';
import * as EmployeeActions from '../../state/employee.actions';
import { EmployeeService } from '../../resources/services/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  @Input() employee!: Employee;

  Role = Role;
  roles = getValueEnum(Role).filter((x) => x !== Role.Empty);
  constructor(private store: Store, private employeeService: EmployeeService) {}

  ChangeRole(role: any) {
    this.store.dispatch(
      EmployeeActions.updateEmployeeRole({ id: this.employee.id, role: role })
    );
  }

  ResendEmail() {
    this.store.dispatch(
      EmployeeActions.resendEmployeeEmail({ id: this.employee.id })
    );
  }

  ngOnInit(): void {}
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }
}
