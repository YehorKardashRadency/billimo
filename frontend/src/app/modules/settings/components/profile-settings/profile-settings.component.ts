import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {selectProfileSettings, selectSettings} from "../../state/settings-page.selectors";
import {openEditProfileModal} from "../../state/settings-page.actions";
import {ProfileSettingsModel} from "../../resources/models/profile-settings.model";

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {

  profile$?:Observable<ProfileSettingsModel | null>

  constructor(private store$: Store) { }

  ngOnInit(): void {
    this.profile$ = this.store$.pipe(select(selectProfileSettings));
  }

  openModal() {
    this.store$.dispatch(openEditProfileModal())
  }

  selectImage(avatar:string|null) {
    let st = avatar ?? "assets/images/icons/avatar.svg";
    return `url('${st}')`;
  }
}
