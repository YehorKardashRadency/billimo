import { NgModule } from '@angular/core';
import { SettingsComponent } from './components/settings-page/settings.component';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { PasswordSettingsComponent } from './components/password-settings/password-settings.component';
import { EmailSettingsComponent } from './components/email-settings/email-settings.component';
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {reducer, settingsPageKey} from "./state/settings-page.reducer";
import {SettingsPageEffects} from "./state/settings-page.effects";
import { EditProfileModalComponent } from './components/profile-settings/edit-profile-modal/edit-profile-modal.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { ChangePasswordModalComponent } from './components/password-settings/change-password-modal/change-password-modal.component';

const routes: Routes = [
  { path: '', component: SettingsComponent }
];

@NgModule({
  declarations: [
    SettingsComponent,
    ProfileSettingsComponent,
    PasswordSettingsComponent,
    EmailSettingsComponent,
    EditProfileModalComponent,
    ChangePasswordModalComponent,
  ],
  imports: [
    StoreModule.forFeature(settingsPageKey, reducer),
    EffectsModule.forFeature([SettingsPageEffects]),
    RouterModule.forChild(routes),
    SharedModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class SettingsModule { }
