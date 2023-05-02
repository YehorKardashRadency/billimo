import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store';
import { Employee } from '../../resources/models/employee';
import { selectInvitedEmployee, selectRegistrationError} from '../../state/employee.selectors';
import { finishEmployeeRegistration, persistEmployeeId } from '../../state/employee.actions';
import { FinishEmployeeRegistration } from '../../resources/models/finishEmployeeRegistration';

interface CustomValidatorConfig {
  pattern: RegExp;
  msg: string;
}

@Component({
  selector: 'app-finish-employee-registration',
  templateUrl: './finish-employee-registration.component.html',
  styleUrls: ['./finish-employee-registration.component.scss'],
})
export class FinishEmployeeRegistrationComponent implements OnInit {
  form: FormGroup;
  invitedEmployee$?: Observable<Employee | null>;
  registrationError$: Observable<string | null>;

  constructor(private store: Store<AppState>) {
    this.form = new FormGroup({
      oneTimePassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        this.customPatternValidator({
          pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
          msg: 'Weak password',
        }),
      ]),
      terms: new FormControl(false, [Validators.requiredTrue]),
    });
    this.registrationError$ = this.store.pipe(select(selectRegistrationError));
  }

  ngOnInit() {
    this.invitedEmployee$ = this.store.pipe(select(selectInvitedEmployee));
    this.store.dispatch(persistEmployeeId());
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    var data: FinishEmployeeRegistration = {
      oneTimePassword: this.form.get('oneTimePassword')!.value,
      newPassword: this.form.get('newPassword')!.value
    };

    this.store.dispatch(finishEmployeeRegistration({ data }));
  }

  public customPatternValidator(config: CustomValidatorConfig): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let urlRegEx: RegExp = config.pattern;
      if (control.value && !control.value.match(urlRegEx)) {
        return {
          invalidMsg: config.msg,
        };
      } else {
        return null;
      }
    };
  }
  public getFormControl(controlName: string) {
    return this.form?.get(controlName) as FormControl;
  }
}
