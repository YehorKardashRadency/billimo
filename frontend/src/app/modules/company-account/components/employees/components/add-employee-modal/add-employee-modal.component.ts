import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { Role } from 'src/app/modules/auth/resources/models/Role';
import { addEmployee } from '../../state/employee.actions';
import { RegisterEmployee } from '../../resources/models/registerEmployee';
import { Observable } from 'rxjs';
import { selectServerErrors } from '../../state/employee.selectors';

interface CustomValidatorConfig {
  pattern: RegExp;
  msg: string;
}

@Component({
  selector: 'app-add-employee-modal',
  templateUrl: './add-employee-modal.component.html',
  styleUrls: ['./add-employee-modal.component.scss'],
})
export class AddEmployeeModalComponent implements OnInit {
  employeeForm: FormGroup | null = null;
  roles: string[] = Object.keys(Role).filter(x => isNaN(Number(x)) && x !== 'Empty');
  serverErrors$: Observable<ValidationErrors | null>;

  constructor(
    public dialogRef: MatDialogRef<AddEmployeeModalComponent>,
    private store: Store<AppState>
  ) {
    this.serverErrors$ = this.store.pipe(select(selectServerErrors));
  }

  ngOnInit(): void {
    this.employeeForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [
        Validators.required,
        this.customPatternValidator({
          pattern: /^[a-zA-z]{1,75} [a-zA-z]{1,75}$/,
          msg: 'Wrong name and surname',
        }),
      ]),
      role: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    this.employeeForm!.markAllAsTouched();
    if (!this.employeeForm!.valid) return;

    const [firstName, lastName] = this.getFormControl('name').value.split(' ');

    var employee: RegisterEmployee = {
      email: this.getFormControl('email').value,
      firstName,
      lastName,
      role: +Role[this.getFormControl('role').value]
    }

    this.store.dispatch(addEmployee({ employee }));
  }

  getFormControl(controlName: string) {
    return this.employeeForm?.get(controlName) as FormControl;
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
}
