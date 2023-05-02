import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';

import { ApiService } from 'src/app/core/resources/services/api.service';
import { User } from 'src/app/modules/auth/resources/models/User';
import * as CoreActions from '../actions/core.actions';

@Injectable()
export class CoreEffects {

  coreGetCurrentUserInfo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoreActions.coreGetCurrentUserInfo),
      concatMap(() =>
        this.apiService.get<User>("/gateway/user/currentuserinfo").pipe(
          map((user) => CoreActions.coreGetCurrentUserInfoSuccess({ user: user }))
          ,catchError((error) => of(CoreActions.coreGetCurrentUserInfoFailure({ error:error?.error?.errors ?? {}})) )
        )
      )
    );
  });

  constructor(private actions$: Actions, private apiService: ApiService) { }
}
