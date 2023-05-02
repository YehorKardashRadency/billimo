import { CanOpenVerification, CanOpenAddress } from './company-onboarding.guard';
import { CompanyOnboardingComponent } from './company-onboarding.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationStageComponent } from './stages/registration-stage/registration-stage.component';
import { VerificationStageComponent } from './stages/verification-stage/verification-stage.component';
import { AddressStageComponent } from './stages/address-stage/address-stage.component';

const routes: Routes = [
    {
        path: '',
        pathMatch:'full',
        redirectTo: 'registration'
    },
    {
        path: '',
        component: CompanyOnboardingComponent,
        children: [
            {path:'registration',component:RegistrationStageComponent},
            {
                path: 'verification', component: VerificationStageComponent,
                canActivate: [CanOpenVerification]
            },
            {
                path: 'address', component: AddressStageComponent,
                canActivate: [CanOpenAddress]
            },
        ]
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyOnoboardingRoutingModule { }
