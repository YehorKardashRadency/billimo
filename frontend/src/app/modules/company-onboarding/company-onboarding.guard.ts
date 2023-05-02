import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { map, Observable } from "rxjs";
import { AppState } from "src/app/store";
import * as fromOnboarding from './resources/state/onboarding.selector';
import { CompanyValidationForm } from "./resources/models/CompanyValidationForm";
@Injectable({
    providedIn: 'root'
})
export class CanOpenVerification implements CanActivate {

    constructor(
        private store: Store<AppState>,
        private route: Router
    ) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {
        return this.checkState();
    }
    checkState(): Observable<boolean> {
        return this.store.pipe(select(fromOnboarding.onboardingStateSelector), map(state => {
            const formValid = registrationFormValid(state.registrationForm);
            if (state.serverErrors || !formValid) {
                this.route.navigateByUrl('company-onboarding/registration');
                return false;
            }
            return true
        }))
    }
}

@Injectable({
    providedIn: 'root'
})
export class CanOpenAddress implements CanActivate {

    constructor(
        private store: Store<AppState>,
        private route: Router
    ) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {
        return this.checkState();
    }
    checkState(): Observable<boolean> {
        return this.store.pipe(select(fromOnboarding.onboardingStateSelector), map(state => {
            const formValid = registrationFormValid(state.registrationForm);
            if (state.serverErrors ||
                !formValid
            ) {
                this.route.navigateByUrl('company-onboarding/registration');
                return false;
            }
            if (state.businessType == '') {
                this.route.navigateByUrl('company-onboarding/verification');
                return false;
            }
            return true
        }))
    }
}


function registrationFormValid(registrationForm: CompanyValidationForm) {
    return !(registrationForm.companyName == '' ||
        registrationForm.email == '' ||
        registrationForm.firstName == '' ||
        registrationForm.lastName == '' ||
        registrationForm.password == '')
}
