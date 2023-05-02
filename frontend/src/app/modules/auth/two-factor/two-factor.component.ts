import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ButtonConfig} from "../../../shared/button/button.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {select, Store} from "@ngrx/store";
import {backToLoginPage, loginPage, resendTwoFactorCode} from "../../../store/actions/auth.actions";
import {LoginRequest} from "../resources/models/LoginRequest";
import {selectErrors} from "../../../store/selectors/auth.selectors";
@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.scss'],

})
export class TwoFactorComponent implements OnInit, OnDestroy {
  @Input('loginRequest') loginRequest?:LoginRequest;

  backButton: ButtonConfig = {
    text: "Back",
    onClick: undefined,
  };

  submitDisabled = true;
  submitButton: ButtonConfig = {
    text: "Submit",
    onClick: undefined,
  }

  form = new FormGroup({
    "code": new FormControl<string>("", [ Validators.required, Validators.pattern(/^\d{6}$/) ]),
  });

  formChanges$?: Subscription;
  errors$?: Observable<string[]>;

  constructor(private store$: Store) { }

  ngOnInit(): void {
    this.formChanges$ = this.form.valueChanges.subscribe(x => {
      this.submitDisabled = !this.form.valid;
    })

    this.errors$ = this.store$.pipe(select(selectErrors));
  }

  ngOnDestroy(): void {
    this.formChanges$?.unsubscribe();
  }

  onSubmit(): void{
    const values = this.form.value;

    if (!this.form.valid)
      return;

    if (this.loginRequest){
      const request = {...this.loginRequest, twoFactorCode: values.code!};
      this.store$.dispatch(loginPage({ loginRequest: request }));
    }
  }

  resendCode() {
    if (this.loginRequest)
      this.store$.dispatch(resendTwoFactorCode({ loginRequest: this.loginRequest }));
  }

  onBack() {
    this.store$.dispatch(backToLoginPage());
  }
}
