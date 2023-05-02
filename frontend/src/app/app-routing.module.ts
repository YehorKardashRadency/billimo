import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {ShellComponent} from './core/resources/modules/shell/shell.component';

import { LoginGuard } from './core/resources/services/guards/login.guard';
import { PayBillComponent } from './modules/bills/pay-bill/pay-bill.component';
import { PublicPayBillComponent } from './modules/bills/public-pay-bill/public-pay-bill.component';
import { BillGuard } from './modules/bills/resources/guard/bill.guard';
import { FinishEmployeeRegistrationComponent } from './modules/company-account/components/employees/components/finish-employee-registration/finish-employee-registration.component';
import { EmployeeGuard } from './modules/company-account/components/employees/resources/guards/employee.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'company-onboarding',
    loadChildren: () =>
      import('./modules/company-onboarding/company-onboarding.module').then(
        (m) => m.CompanyOnboardingModule
      ),
  },
  {
    path: '',
    canActivate:[LoginGuard],
    canActivateChild: [LoginGuard],
    component: ShellComponent,
    children: [
      {
        path: 'invoices',
        loadChildren: () =>
          import('./modules/invoices/invoices.module').then(
            (m) => m.InvoicesModule
          ),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'company',
        loadChildren: () =>
          import('./modules/company-account/company-account.module').then(
            (m) => m.CompanyAccountModule
          ),
      },
      {
        path: 'bills',
        loadChildren: () =>
          import('./modules/bills/bills.module').then(
            (m) => m.BillsModule
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./modules/settings/settings.module').then((m) => m.SettingsModule),
      },
    ],
  },
  { path: 'invoice', canActivate:[LoginGuard],
    loadChildren:() => import('./modules/invoices/invoices.module')
      .then(m => m.InvoicesModule) },
  { path: 'bills/received/:billId', canActivate: [BillGuard], component: PayBillComponent },
  { path: 'bills/preview/:billId', canActivate: [BillGuard], component: PublicPayBillComponent },
  { path: 'company/finish-registration/:userId', canActivate: [EmployeeGuard], component: FinishEmployeeRegistrationComponent },
  { path:'**',redirectTo:''},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
