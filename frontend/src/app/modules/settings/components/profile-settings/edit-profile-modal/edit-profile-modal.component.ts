import {Component, OnDestroy, OnInit} from '@angular/core';
import {ButtonConfig} from "../../../../../shared/button/button.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {Observable, Subscription} from "rxjs";
import {UserSettingsModel} from "../../../resources/models/user-settings.model";
import {isModalLoading, selectSettings} from "../../../state/settings-page.selectors";
import {ProfileSettingsModel} from "../../../resources/models/profile-settings.model";
import {closeEditProfileModal, updateProfileSettings} from "../../../state/settings-page.actions";
import {ValidateFilesize} from "./validators/filesize.validator";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss']
})
export class EditProfileModalComponent implements OnInit, OnDestroy {
  cancelButtonConfig: ButtonConfig = {
    text: 'Cancel',
    onClick: undefined,
  };

  saveButtonConfig: ButtonConfig = {
    text: 'Save',
    disabled: true,
    onClick: undefined,
  };

  form = new FormGroup({
    "name": new FormControl<string>("", [Validators.required, Validators.pattern(/^[A-Za-z]+(?:\s[A-Za-z]+)+$/)]),
    "avatar": new FormControl<string | null>(null, [ValidateFilesize]),
  });

  profile$?:Observable<UserSettingsModel | null>;
  profileSubscription$?: Subscription;
  formChanges$?: Subscription;
  isLoading$?:Observable<boolean>

  constructor(private store$: Store, private ref: MatDialogRef<EditProfileModalComponent>) { }

  ngOnInit(): void {
    this.profile$ = this.store$.pipe(select(selectSettings));
    this.isLoading$ = this.store$.pipe(select(isModalLoading));

    this.profileSubscription$ = this.profile$.subscribe(x => {
      if (x) {
        this.form.patchValue({ name: x.name, avatar: x.avatar }, {emitEvent: false})
      }
    });

    this.formChanges$ = this.form.valueChanges.subscribe(x => {
      this.saveButtonConfig.disabled = false;
    })
  }

  ngOnDestroy() {
    this.formChanges$?.unsubscribe();
    this.profileSubscription$?.unsubscribe();
  }

  onSubmit(){
    if (!this.form.valid){
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.value;
    const model:ProfileSettingsModel = {
      avatar: values.avatar ?? null,
      name: values.name!,
    }

    this.store$.dispatch(updateProfileSettings({settings: model}));
  }

  onFileChange($event: Event) {
    const input = $event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const fileUrl = reader.result;
        this.form.patchValue({
          avatar: fileUrl?.toString()
        });

        this.form.controls.avatar.markAsTouched();
      }

    }
  }

  selectImage():string {
    let st = "assets/images/icons/avatar.svg";

    if (this.form.value.avatar)
      st = this.form.value.avatar

    return `url('${st}')`;
  }

  remove() {
    this.form.patchValue({avatar: null});
  }

  close() {
    this.store$.dispatch(closeEditProfileModal());
  }
}
