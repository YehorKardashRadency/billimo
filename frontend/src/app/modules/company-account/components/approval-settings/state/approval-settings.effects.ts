import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as ApprovalSettingsActions from "../state/approval-settings.actions";
import {catchError, map, mergeMap, switchMap} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {ApprovalSettingsService} from "../resources/services/approval-settings.service";
import {of} from "rxjs";

@Injectable()
export class ApprovalSettingsEffects {
  loadApprovalSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApprovalSettingsActions.loadApprovalSettings),
      mergeMap((action) => {
          return this.approvalSettingsService.getSettings$().pipe(
            map((data) =>
              ApprovalSettingsActions.loadApprovalSettingsSuccess({result: data})
            ),
            catchError((error) =>
              of(ApprovalSettingsActions.loadApprovalSettingsFailed({error:error?.error?.errors ?? {}}))
            )
          )
        }
      )
    );
  });

  updateApprovalSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApprovalSettingsActions.updateApprovalSettings),
      switchMap((action) => {
          return this.approvalSettingsService.updateSettings$(action.model).pipe(
            map((data) =>
              ApprovalSettingsActions.updateApprovalSettingsSuccess()
            ),
            catchError((error) =>
              of(ApprovalSettingsActions.updateApprovalSettingsFailed({error:error?.error?.errors ?? {}}))
            )
          )
        }
      )
    );
  });

  constructor(private actions$: Actions, private store: Store, private approvalSettingsService: ApprovalSettingsService) { }
}
