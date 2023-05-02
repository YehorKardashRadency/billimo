import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { firstValueFrom, Observable } from 'rxjs';
import { AppState } from 'src/app/store';
import { CompanyValidationForm } from '../../resources/models/CompanyValidationForm';
import { serverValidationErrorsSelector, registrationFormSelector } from '../../resources/state/onboarding.selector';
import { openSuccessfullRegistrationDialog, saveForm } from '../../resources/state/onboarding.actions';
import { ActivatedRoute } from '@angular/router';


interface CustomValidatorConfig {
  pattern: RegExp,
  msg: string;
}

@Component({
  selector: 'app-registration-stage',
  templateUrl: './registration-stage.component.html',
  styleUrls: ['./registration-stage.component.scss','../../resources/styles/stage.scss']
})
export class RegistrationStageComponent implements OnInit {

  form: FormGroup = new FormGroup({
    'companyName': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(75)]),
    'email': new FormControl('', [Validators.required, Validators.email]),
    'name': new FormControl('', [Validators.required,
    this.customPatternValidator({ pattern: /^[a-zA-z]{1,75} [a-zA-z]{1,75}$/, msg: "Wrong name" })
    ]),
    'password': new FormControl('', [Validators.required,
    this.customPatternValidator({ pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, msg: "Weak password" })]),
  });
  serverErrors$: Observable<ValidationErrors | undefined>;
  constructor(private store: Store<AppState>, public route: ActivatedRoute) {
    this.serverErrors$ = store.pipe(select(serverValidationErrorsSelector));
  }
  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    const [firstName, lastName] = this.form.controls['name'].value.split(' ');
    const result: CompanyValidationForm = {
      companyName: this.form.controls['companyName'].value,
      email: this.form.controls['email'].value,
      firstName: firstName,
      lastName: lastName,
      password: this.form.controls['password'].value,
    };
    this.store.dispatch(saveForm({
      form: result
    }))
  }
  ngOnInit(): void {
    firstValueFrom(this.store.pipe(select(registrationFormSelector))).then((storedForm) => {
      this.form.controls['companyName'].setValue(storedForm.companyName);

      if (this.route.snapshot.queryParams['email']) {
        this.form.controls['email'].setValue(this.route.snapshot.queryParams['email']);
      } else {
        this.form.controls['email'].setValue(storedForm.email);
      }
      if (storedForm.firstName != '' && storedForm.lastName != '')
        this.form.controls['name'].setValue(storedForm.firstName + ' ' + storedForm.lastName);
      this.form.controls['password'].setValue(storedForm.password);
    });


  }
  public customPatternValidator(config: CustomValidatorConfig): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let urlRegEx: RegExp = config.pattern;
      if (control.value && !control.value.match(urlRegEx)) {
        return {
          invalidMsg: config.msg
        };
      } else {
        return null;
      }
    };
  }
  public getFormControl(controlName: string) {
    return this.form.get(controlName) as FormControl;
  }
}

