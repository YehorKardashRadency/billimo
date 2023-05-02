import {Component, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, Observable, Subscription} from "rxjs";
import {UserSettingsModel} from "../../resources/models/user-settings.model";
import {select, Store} from "@ngrx/store";
import {isModalLoading, selectSettings} from "../../state/settings-page.selectors";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EmailSettingsModel} from "../../resources/models/email-settings.model";
import {updateEmailSettings} from "../../state/settings-page.actions";

@Component({
  selector: 'app-email-settings',
  templateUrl: './email-settings.component.html',
  styleUrls: ['./email-settings.component.scss']
})
export class EmailSettingsComponent implements OnInit, OnDestroy {

  profile$?:Observable<UserSettingsModel | null>
  setInitialFormValues$?:Subscription;
  trackFormChanges$?:Subscription;

  form = new FormGroup({
    "twoFactorEnabled": new FormControl<boolean>(false, [Validators.required]),
    "notificationsEnabled": new FormControl<boolean>(false, [Validators.required]),
  });

  constructor(private store$: Store) { }

  ngOnInit(): void {
    this.profile$ = this.store$.pipe(select(selectSettings));

    this.setInitialFormValues$ = this.profile$.subscribe(x => {
      this.form.patchValue({twoFactorEnabled: x?.twoFactorEnabled, notificationsEnabled: x?.notificationsEnabled},
        {emitEvent: false})
    })

    this.trackFormChanges$ = this.form.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(x => {
      if (x){
        const model:EmailSettingsModel = {
          notificationsEnabled: x.notificationsEnabled ?? false,
          twoFactorEnabled: x.twoFactorEnabled ?? false,
        }

        this.onSubmit(model);
      }
    })
  }

  onSubmit(model: EmailSettingsModel){
    this.store$.dispatch(updateEmailSettings({settings: model }));
  }

  ngOnDestroy(): void {
    this.setInitialFormValues$?.unsubscribe();
    this.trackFormChanges$?.unsubscribe();
  }
}
