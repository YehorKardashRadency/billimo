import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import * as fromAuth from '../../store/reducers/auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from '../../store/effects/auth.effects';
import { LoginComponent } from './login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TwoFactorComponent } from './two-factor/two-factor.component';
import { OneTimeCodeComponent } from './two-factor/one-time-code/one-time-code.component';

@NgModule({
  declarations: [
    LoginComponent,
    TwoFactorComponent,
    OneTimeCodeComponent
  ],
  imports: [
    CommonModule, 
    FormsModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    StoreModule.forFeature(
      fromAuth.authFeatureKey,
      fromAuth.reducer
    ),
    EffectsModule.forFeature([AuthEffects])],
  exports: [LoginComponent],
})
export class AuthModule {}
