import {CompanyRoutingModule} from './company-account.routing';
import {NgModule} from "@angular/core";
import {SharedModule} from "src/app/shared/shared.module";
import {CompanyAccountComponent} from "./company-account.component";
import {EmployeesComponent} from './components/employees/employees.component';
import {AdressesComponent} from './components/adresses/adresses.component';
import {PaymentMethodsComponent} from './components/payment-methods/payment-methods.component';
import {DocumentsComponent} from './components/documents/documents.component';
import {EmployeeComponent} from './components/employees/components/employee/employee.component';
import {AuthModule} from "../auth/auth.module";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {EmployeeEffects} from "./components/employees/state/employee.effects";
import { RouterModule } from '@angular/router';
import { PaymentMethodsItemComponent } from "./components/payment-methods/payment-methods-item/payment-methods-item.component";

import { AddressModalComponent } from './components/address-modal/address-modal.component';
import { AddressAddedModalComponent } from './components/address-added-modal/address-added-modal.component';
import {companyAccountFeatureKey, reducers} from "./state/company-account.reducer";
import {PaymentMethodsEffects} from "./components/payment-methods/state/payment-methods.effects";
import { PaymentMethodSuccessModalComponent } from './components/payment-methods/payment-method-success-modal/payment-method-success-modal.component';
import { ApprovalSettingsComponent } from './components/approval-settings/approval-settings.component';
import {DocumentsEffects} from "./components/documents/state/documents.effects";
import {ApprovalSettingsEffects} from "./components/approval-settings/state/approval-settings.effects";
import { AddEmployeeModalComponent } from './components/employees/components/add-employee-modal/add-employee-modal.component';
import { FinishEmployeeRegistrationComponent } from './components/employees/components/finish-employee-registration/finish-employee-registration.component';

@NgModule({
  declarations: [
    CompanyAccountComponent,
    EmployeesComponent,
    AdressesComponent,
    PaymentMethodsComponent,
    DocumentsComponent,
    EmployeeComponent,
    CompanyAccountComponent,
    PaymentMethodsComponent,
    AddressModalComponent,
    AddressAddedModalComponent,
    PaymentMethodsItemComponent,
    PaymentMethodSuccessModalComponent,
    ApprovalSettingsComponent,
    AddEmployeeModalComponent,
    FinishEmployeeRegistrationComponent
  ],
  imports: [
    RouterModule,
    CompanyRoutingModule,
    SharedModule,
    AuthModule,
    StoreModule.forFeature(companyAccountFeatureKey,reducers),
    EffectsModule.forFeature([EmployeeEffects, PaymentMethodsEffects, DocumentsEffects, ApprovalSettingsEffects])
  ],
  bootstrap: [CompanyAccountComponent]

})
export class CompanyAccountModule {
}
