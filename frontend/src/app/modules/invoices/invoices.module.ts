import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { CsvModule } from '@ctrl/ngx-csv';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../../shared/shared.module';
import { AllCompaniesDropdownComponent } from './components/all-companies-dropdown/all-companies-dropdown.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { CurrentComponent } from './components/current/current.component';
import { InvoiceDetailsComponent } from './components/invoice-details/invoice-details.component';
import { InvoiceRequestsConfirmComponent } from './components/invoice-requests-confirm/invoice-requests-confirm.component';
import { InvoicesTableWrapperComponent } from './components/invoices-table-wrapper/invoices-table-wrapper.component';
import { RequestsComponent } from './components/requests/requests.component';
import { SortByComponent } from './components/sort-by/sort-by.component';
import { TemplatesComponent } from './components/templates/templates.component';
import { CompanySearchComponent } from './create-invoice/company-search/company-search.component';
import { CounterComponent } from './create-invoice/counter/counter.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { InvoiceTemplateComponent } from './create-invoice/invoice-template/invoice-template.component';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoicesComponent } from './invoices.component';
import { InvoiceEffects } from './resources/state/effects/invoice.effects';
import { TemplatesEffects } from './resources/state/effects/templates.effects';
import { RegularComponent } from './components/regular/regular.component';

@NgModule({
  declarations: [
    InvoicesComponent,
    RequestsComponent,
    TemplatesComponent,
    ArchiveComponent,
    CurrentComponent,
    CreateInvoiceComponent,
    CounterComponent,
    CompanySearchComponent,
    InvoiceDetailsComponent,
    AllCompaniesDropdownComponent,
    InvoiceTemplateComponent,
    SortByComponent,
    InvoicesTableWrapperComponent,
    InvoiceRequestsConfirmComponent,
    RegularComponent,
  ],
  imports: [
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
    InvoicesRoutingModule,
    SharedModule,
    RouterModule,
    InvoicesRoutingModule,
    SharedModule,
    EffectsModule.forFeature([InvoiceEffects,TemplatesEffects]),
    CsvModule,
  ],
  bootstrap: [InvoicesComponent],
  exports:[]
})
export class InvoicesModule {}
