import { RegularComponent } from './components/regular/regular.component';
import { EditInvoiceResolver } from './resources/services/edit.invoice.resolver';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicesComponent } from './invoices.component';
import { CurrentComponent } from './components/current/current.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { RequestsComponent } from './components/requests/requests.component';
import { TemplatesComponent } from './components/templates/templates.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'current',
    pathMatch: 'full'
  },
  {
    path: '',
    component: InvoicesComponent,
    children: [
      { path: 'current', component: CurrentComponent },
      { path: 'requests', component: RequestsComponent },
      { path: 'templates', component: TemplatesComponent },
      { path: 'archive', component: ArchiveComponent },
      { path:'regular', component: RegularComponent},
    ],
  },
  {
    path: 'create', component: CreateInvoiceComponent
  },
  {
    path: 'edit', component:CreateInvoiceComponent,
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicesRoutingModule { }
