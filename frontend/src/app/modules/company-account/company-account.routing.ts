import { PaymentMethodsComponent } from './components/payment-methods/payment-methods.component';
import { AdressesComponent } from './components/adresses/adresses.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { RouterModule, Routes } from '@angular/router';
import { CompanyAccountComponent } from './company-account.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'employees',
    pathMatch: 'full'
  },
  {
    path: '',
    component: CompanyAccountComponent,
    children: [
      { path: 'employees', component: EmployeesComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: 'adresses', component: AdressesComponent },
      { path: 'payment-methods', component: PaymentMethodsComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
