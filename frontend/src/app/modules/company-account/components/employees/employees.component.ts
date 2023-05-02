import { Component, OnInit } from '@angular/core';
import { ButtonConfig } from '../../../../shared/button/button.component';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { selectEmployees } from './state/employee.selectors';
import * as EmployeeActions from './state/employee.actions';
import {
  selectCompany,
  selectIsVerified,
} from 'src/app/store/selectors/company.selectors';
import { CompanyModel } from 'src/app/shared/models/CompanyModel';
import { Observable } from 'rxjs';
import { verifyCompany } from 'src/app/store/actions/company-verification.actions';
import { selectCompanyId } from 'src/app/store/selectors/auth.selectors';
import { openAddUserDialog } from 'src/app/store/actions/dialog.actions';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  verifyCompanyConfig: ButtonConfig = {
    text: 'Verify company',
    onClick: () => this.dispatchVerifyCompanyAction(),
  };
  employees$ = this.store.select(selectEmployees);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(EmployeeActions.loadEmployees());
    this.companySelector$ = this.store.pipe(select(selectCompany));
    this.companyVerified$ = this.store.select(selectIsVerified);
  }

  companyId$ = this.store.select(selectCompanyId);
  companySelector$!: Observable<CompanyModel | null>;
  companyVerified$!: Observable<boolean | undefined>;
  dispatchVerifyCompanyAction() {
    this.companyId$
      .subscribe((company) => {
        this.store.dispatch(verifyCompany({ companyId: company }));
      })
      .unsubscribe();
  }

  openAddEmployeeModal() {
    this.store.dispatch(openAddUserDialog());
  }
}
