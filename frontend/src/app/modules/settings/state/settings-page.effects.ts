import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as SettingsActions from './settings-page.actions';
import {catchError, map, mergeMap, switchMap, tap} from "rxjs/operators";
import {of} from "rxjs";
import {SettingsService} from "../resources/services/settings.service";
import {MatDialog} from "@angular/material/dialog";
import {EditProfileModalComponent} from "../components/profile-settings/edit-profile-modal/edit-profile-modal.component";
import {
  ChangePasswordModalComponent
} from "../components/password-settings/change-password-modal/change-password-modal.component";
import {Store} from "@ngrx/store";
import {closeEditProfileModal, closePasswordSettingsModal} from "./settings-page.actions";
import {coreGetCurrentUserInfo} from "../../../store/actions/core.actions";

@Injectable()
export class SettingsPageEffects {

  loadSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SettingsActions.loadUserSettings),
      mergeMap((action) => {
          return this.settingsService.getUserSettings$().pipe(
            map((data) =>
              SettingsActions.loadUserSettingsSuccess({settings: data})
            ),
            catchError((error) =>
              of(SettingsActions.loadUserSettingsFailed({error:error?.error?.errors ?? {}}))
            )
          )
        }
      )
    );
  });

  updateEmailSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SettingsActions.updateEmailSettings),
      mergeMap((action) => {
          return this.settingsService.updateEmailSettings$(action.settings).pipe(
            map((data) =>
              SettingsActions.updateEmailSettingsSuccess()
            ),
            catchError((error) =>
              of(SettingsActions.updateEmailSettingsFailed({error:error?.error?.errors ?? {}}))
            )
          )
        }
      )
    );
  });

  openEditProfileModal$ = createEffect(() =>
      this.actions$.pipe(
        ofType(SettingsActions.openEditProfileModal),
        tap(_ => this.dialog.open(EditProfileModalComponent)),
      ),
    { dispatch: false }
  );

  openChangePasswordModal$ = createEffect(() =>
      this.actions$.pipe(
        ofType(SettingsActions.openChangeSettingsModal),
        tap(_ => this.dialog.open(ChangePasswordModalComponent)),
      ),
    { dispatch: false }
  );

  updateProfileSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SettingsActions.updateProfileSettings),
      switchMap((action) => {
          return this.settingsService.updateProfileSettings$(action.settings).pipe(
            map((data) => {
              this.store$.dispatch(closeEditProfileModal());
              return SettingsActions.updateProfileSettingsSuccess({settings: action.settings});
              }
            ),
            catchError((error) =>
              of(SettingsActions.updateProfileSettingsFailed({error:error?.error?.errors ?? {}}))
            )
          )
        }
      )
    );
  });

  closeChangePasswordModal$ = createEffect(() =>
      this.actions$.pipe(
        ofType(SettingsActions.closeEditProfileModal),
        tap(_ => this.dialog.closeAll()),
      ),
    { dispatch: false }
  );

  updatePasswordSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SettingsActions.updatePasswordSettings),
      switchMap((action) => {
          return this.settingsService.updatePasswordSettings$(action.settings).pipe(
            map((data) => {
                this.store$.dispatch(closePasswordSettingsModal())
                return SettingsActions.updatePasswordSettingsSuccess()
              }
            ),
            catchError((error) =>
            {
              return of(SettingsActions.updatePasswordSettingsFailed({errors: error?.error?.errors ?? {}}))
            }
            )
          )
        }
      )
    );
  });

  closePasswordModal$ = createEffect(() =>
      this.actions$.pipe(
        ofType(SettingsActions.closePasswordSettingsModal),
        tap(_ => this.dialog.closeAll()),
      ),
    { dispatch: false }
  );

  updateMenu$ = createEffect(() =>
      this.actions$.pipe(
        ofType(SettingsActions.updateProfileSettingsSuccess),
        tap(_ => this.store$.dispatch(coreGetCurrentUserInfo())),
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private settingsService: SettingsService,
    private dialog: MatDialog,
    private store$: Store,
  ) {}
}
