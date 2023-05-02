import { CompanyVerificationEffects } from './store/effects/company-verification.effects';
import { GetCurrentInvoicesEffects } from './modules/invoices/resources/state/effects/invoices.effects';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DialogEffects } from './store/effects/dialog.effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShellComponent } from './core/resources/modules/shell/shell.component';
import { AuthModule } from './modules/auth/auth.module';
import { metaReducers, reducers } from './store';
import { AlertEffects } from './store/effects/alert.effects';
import { RouteEffects } from './store/effects/route.effects';
import { ModalEffects } from './store/effects/modal.effects';
import { SharedModule } from './shared/shared.module';
import { MenuComponent } from './core/resources/modules/menu/menu.component';
import { MenuLinkComponent } from './core/resources/modules/menu/menu-link/menu-link.component';
import { SpinnerEffects } from './store/effects/spinner.effects';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './modules/auth/resources/services/auth-interceptor.service';
import { LandingPageComponent } from './core/resources/modules/landing-page/landing-page.component';
import { CoreEffects } from './store/effects/core.effects';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerExampleComponent } from './modules/spinner-example/spinner-example.component';
import { OnboardingEffects } from './modules/company-onboarding/resources/state/onboarding.effects';
import { CompanyEffects } from './store/effects/company.effects';
import { CompanyAccountEffects } from './modules/company-account/state/company-account.effects';
import { MyEntityModule } from './modules/my-entity/my-entity.module';
import { ArchivedInvoices as ArchivedInvoicesEffects } from './modules/invoices/resources/state/effects/archived-invoices.effects';
import { RequestsInvoicesEffects } from './modules/invoices/resources/state/effects/requests-invoices.effects';
import { RegularInvoicesEffects } from './modules/invoices/resources/state/effects/regular.invoices.effects';

@NgModule({
  declarations: [
    AppComponent,
    ShellComponent,
    MenuComponent,
    MenuLinkComponent,
    SpinnerExampleComponent,
    LandingPageComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AuthModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
        strictStateImmutability: false,
        strictActionImmutability: false,
      },
    }),
    BrowserAnimationsModule,
    MyEntityModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([
      SpinnerEffects,
      AlertEffects,
      RouteEffects,
      ModalEffects,
      OnboardingEffects,
      DialogEffects,
      CoreEffects,
      CompanyAccountEffects,
      CompanyEffects,
      GetCurrentInvoicesEffects,
      ArchivedInvoicesEffects,
      RequestsInvoicesEffects,
      CompanyVerificationEffects,
      RegularInvoicesEffects,
    ]),
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
