import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {openChangeSettingsModal} from "../../state/settings-page.actions";

@Component({
  selector: 'app-password-settings',
  templateUrl: './password-settings.component.html',
  styleUrls: ['./password-settings.component.scss']
})
export class PasswordSettingsComponent implements OnInit {

  constructor(private store$: Store) { }

  ngOnInit(): void {
  }

  onPasswordChange() {
    this.store$.dispatch(openChangeSettingsModal())
  }
}
