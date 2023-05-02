import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {loadUserSettings} from "../../state/settings-page.actions";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private store$: Store) { }

  ngOnInit(): void {
    this.store$.dispatch(loadUserSettings())
  }

}
