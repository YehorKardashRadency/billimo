import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { AppState } from 'src/app/store';
import * as fromCompanyVerification from 'src/app/store/actions/company-verification.actions'
import { businessTypeSelector } from '../../resources/state/onboarding.selector';
import { verifyCompany } from '../../resources/state/onboarding.actions';
@Component({
  selector: 'app-verification-stage',
  templateUrl: './verification-stage.component.html',
  styleUrls: ['./verification-stage.component.scss','../../resources/styles/stage.scss']
})
export class VerificationStageComponent implements OnInit {


  form: FormGroup = new FormGroup({
    'businessType': new FormControl('', Validators.required),
  });
  businessTypes = ['Type 1','Type 2','Type 3']

  constructor(private router: Router, private store: Store<AppState>) { }

  ngOnInit(): void {
    firstValueFrom(this.store.pipe(select(businessTypeSelector))).then((storedBusinessType) => {
      if(storedBusinessType!='') this.form.controls['businessType'].setValue(storedBusinessType);
    });
  }
  setBusinessType(value: string) {
    this.form.controls['businessType'].setValue(value);
  }
  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    this.store.dispatch(verifyCompany({ businessType: this.form.controls['businessType'].value }));
    this.store.dispatch(fromCompanyVerification.verificationValueChanged({toggleValue:this.verifyCompany}));
  }
  public getFormControl(controlName: string) {
    return this.form.get(controlName) as FormControl;
  }
  goBack() {
    this.router.navigateByUrl("company-onboarding/registration");
  }

  verifyCompany = false;
  onCompanyVerificationChange(event:any){
    this.verifyCompany = event.target.checked;
  }
}
