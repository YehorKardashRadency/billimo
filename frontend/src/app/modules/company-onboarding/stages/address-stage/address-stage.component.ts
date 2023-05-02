import { Observable } from 'rxjs';
import { selectIsVerified } from './../../../../store/selectors/company.selectors';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { countriesList } from 'src/assets/countries.constant';
import { firstValueFrom, map, tap } from 'rxjs';
import { openTermsAndConditionsDialog } from 'src/app/store/actions/dialog.actions';
import { CompanyRegistrationForm } from '../../resources/models/CompanyRegistrationForm';
import { registrationFormSelector } from '../../resources/state/onboarding.selector';
import { registerCompany } from '../../resources/state/onboarding.actions';
import { isVerificationRequestedSelector } from 'src/app/store/selectors/company-verification.selectors';

@Component({
  selector: 'app-address-stage',
  templateUrl: './address-stage.component.html',
  styleUrls: ['./address-stage.component.scss', '../../resources/styles/stage.scss']
})
export class AddressStageComponent implements OnInit {

  form: FormGroup = new FormGroup({
    'country': new FormControl('', [Validators.required]),
    'city': new FormControl('', [Validators.required]),
    'street': new FormControl('', [Validators.required,Validators.minLength(5),Validators.maxLength(85)]),
    'apartment': new FormControl('',[Validators.minLength(2),Validators.maxLength(85)]),
    'zipCode': new FormControl('', [Validators.required,Validators.minLength(2),Validators.maxLength(10)]),
    'terms':new FormControl(false,[Validators.requiredTrue])
  });

  countries = countriesList;
  constructor(private store: Store<AppState>, private router: Router) { }

  ngOnInit(): void {
    this.isVerificationRequested$ = this.store.select(isVerificationRequestedSelector);
  }
  ngOnDestroy(): void {
  }

  isVerified$!:Observable<boolean>;
  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    firstValueFrom(this.store.pipe(select(registrationFormSelector))).then(registrationForm => {
      const form = {
            address: {
              city: this.form.get('city')!.value,
              country: this.form.get('country')!.value,
              street: this.form.get('street')!.value,
              zipCode: this.form.get('zipCode')!.value,
              apartment: this.form.get('apartment')?.value
            },
            companyData: registrationForm
          } as CompanyRegistrationForm;
          this.store.dispatch(registerCompany({form}));
    })
  }

  isVerificationRequested$!:Observable<boolean>;
 
  openTermsAndConditions() {
    this.store.dispatch(openTermsAndConditionsDialog());
  }
  getFormControl(controlName: string) {
    return this.form.get(controlName) as FormControl;
  }
  goBack() {
    this.router.navigateByUrl("company-onboarding/verification");
  }
}
