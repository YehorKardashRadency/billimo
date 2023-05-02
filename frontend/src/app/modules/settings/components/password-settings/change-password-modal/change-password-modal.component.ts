import { Component, OnInit } from '@angular/core';
import {ButtonConfig} from "../../../../../shared/button/button.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {select, Store} from "@ngrx/store";
import {PasswordSettingsModel} from "../../../resources/models/password-settings.model";
import {
  closeEditProfileModal,
  closePasswordSettingsModal,
  updatePasswordSettings
} from "../../../state/settings-page.actions";
import {Observable} from "rxjs";
import {isModalLoading, selectPasswordErrors} from "../../../state/settings-page.selectors";

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss']
})
export class ChangePasswordModalComponent implements OnInit {
  cancelButtonConfig: ButtonConfig = {
    text: "Cancel",
    onClick: undefined,
  };

  saveButtonConfig: ButtonConfig = {
    text: "Save",
    onClick: undefined,
  }

  form = new FormGroup({
    "oldPassword": new FormControl<string>("", [Validators.required]),
    "newPassword": new FormControl<string>("", [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)]),
  });

  passwordErrors$?: Observable<any>
  isLoading$?:Observable<boolean>

  constructor(private store$: Store, private ref: MatDialogRef<ChangePasswordModalComponent>) { }

  ngOnInit(): void {
    this.passwordErrors$ = this.store$.pipe(select(selectPasswordErrors));
    this.isLoading$ = this.store$.pipe(select(isModalLoading));
  }

  close() {
    this.store$.dispatch(closePasswordSettingsModal());
  }

  onSubmit() {
    if (!this.form.valid){
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.value;
    const model:PasswordSettingsModel = {
      oldPassword: values.oldPassword!,
      newPassword: values.newPassword!,
    }

    this.store$.dispatch(updatePasswordSettings({settings: model}))
  }
}
