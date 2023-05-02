import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as MyEntityActions from './my-entity.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MyEntityService } from '../resources/services/my-entity-api.service';

@Injectable()
export class MyEntityEffects {
  loadMyEntity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MyEntityActions.loadMyEntity),
      mergeMap((action) =>
        this.myEntityService.getData(action.id).pipe(
          map((data) =>
            MyEntityActions.loadMyEntitySuccess({ result: data })
          ),
          catchError((error) =>
            of(MyEntityActions.loadMyEntityFailure({ error:error?.error?.errors ?? {} }))
          )
        )
      )
    );
  });
 
  constructor(
    private actions$: Actions,
    private myEntityService: MyEntityService
  ) {}
}
