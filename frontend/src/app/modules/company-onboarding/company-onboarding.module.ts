import { ModalActionsContainerComponent } from './../../shared/modal/modal-actions-container/modal-actions-container.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CompanyOnoboardingRoutingModule } from './company-onboarding.routing';
import { CompanyOnboardingComponent } from './company-onboarding.component';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { RegistrationStageComponent } from './stages/registration-stage/registration-stage.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { VerificationStageComponent } from './stages/verification-stage/verification-stage.component';
import { AddressStageComponent } from './stages/address-stage/address-stage.component';
import { TermsAndConditionsModalComponent } from './terms-and-conditions-modal/terms-and-conditions-modal.component';
import { RegistrationSuccessModalComponent } from './registration-success-modal/registration-success-modal.component';
import { CompanyRoutingModule } from '../company-account/company-account.routing';


@NgModule({
    declarations: [
        RegistrationStageComponent,
        CompanyOnboardingComponent,
        ErrorMessageComponent,
        VerificationStageComponent,
        AddressStageComponent,
        TermsAndConditionsModalComponent,
        RegistrationSuccessModalComponent,
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        RouterModule,
        CompanyOnoboardingRoutingModule,
        SharedModule,
    ],
    bootstrap: [CompanyOnboardingComponent],
    exports:[RegistrationStageComponent]

})
export class CompanyOnboardingModule { }
