import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {select, Store} from '@ngrx/store';
import { ButtonConfig } from 'src/app/shared/button/button.component';
import { AppState } from 'src/app/store';
import * as AuthAction from  'src/app/store/actions/auth.actions';
import { AuthService } from '../resources/services/auth.service';
import {selectErrors, selectTwoFactorRequired} from "../../../store/selectors/auth.selectors";
import {Observable, tap} from "rxjs";
import {LoginRequest} from "../resources/models/LoginRequest";
import {isSpinnerShowing} from "../../../store/selectors/spinner.selectors";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitCfg:ButtonConfig = {onClick:()=>this.submit,text:"Login",disabled:false}
  email:FormControl = new FormControl('', [Validators.required]);
  password:FormControl = new FormControl('', [Validators.required]);
  errors$?: Observable<string[]>;

  request?:LoginRequest;
  twoFactorRequired$?: Observable<boolean>
  loading$?: Observable<boolean>;
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    });

    this.twoFactorRequired$ = this.store.pipe(select(selectTwoFactorRequired));
    this.loading$ = this.store.pipe(select(isSpinnerShowing));
    this.errors$ = this.store.pipe(select(selectErrors));
  }

  submit(){
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const values = this.loginForm.value;
    this.request = {
      email: values.email,
      password: values.password,
    }

    this.store.dispatch(AuthAction.loginPage({loginRequest: this.request}));
  }
}
