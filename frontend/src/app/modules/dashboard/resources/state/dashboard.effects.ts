import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as DashboardActions from './dashboard.actions';
import {mergeMap, map, catchError, tap, debounce} from 'rxjs/operators';
import {interval, of} from 'rxjs';
import {DashboardService} from "../services/dashboard.service";
import {DialogComponent} from "../../../../shared/success-modal-example/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {
  NotificationsModalSearchComponent
} from "../../notifications/notifications-modal-search/notifications-modal-search.component";
import {
  TransactionsModalSearchComponent
} from "../../transactions/transactions-modal-search/transactions-modal-search.component";

@Injectable()
export class DashboardEffects {
  loadActions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DashboardActions.loadQuickActions),
      mergeMap((action) =>
        this.dashboardService.getActions$().pipe(
          map((data) =>
            DashboardActions.loadQuickActionsSuccess({ result: data })
          ),
          catchError((error) =>
            of(DashboardActions.loadQuickActionsFailure({error:error?.error?.errors ?? {}}))
          )
        )
      )
    );
  });

  loadNotifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DashboardActions.loadNotifications),
      mergeMap((action) =>
        this.dashboardService.getNotifications$(1, action.take, "", true, undefined).pipe(
          map((data) =>
            DashboardActions.loadNotificationsSuccess({ result: data })
          ),
          catchError((error) =>
            of(DashboardActions.loadNotificationsFailure({error:error?.error?.errors ?? {}}))
          )
        )
      )
    );
  });

  findNotifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DashboardActions.findNotifications),
      mergeMap((action) =>
        this.dashboardService.getNotifications$(action.page, action.take,action.searchString ?? "",
          action.isDescending, action.days).pipe(
          map((data) =>
            DashboardActions.findNotificationsSuccess({ result: data })
          ),
          catchError((error) =>
            of(DashboardActions.findNotificationsFailed({error:error?.error?.errors ?? {}}))
          )
        )
      )
    );
  });

  loadTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DashboardActions.loadTransactions),
      mergeMap((action) =>
        this.dashboardService.getTransactions$(1, action.take, "", true, undefined).pipe(
          map((data) =>
            DashboardActions.loadTransactionsSuccess({ result: data })
          ),
          catchError((error) =>
            of(DashboardActions.loadTransactionsFailure({error:error?.error?.errors ?? {}}))
          )
        )
      )
    );
  });

  findTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DashboardActions.findTransactions),
      mergeMap((action) =>
        this.dashboardService.getTransactions$(action.page, action.take,action.searchString ?? "",
          action.isDescending, action.days).pipe(
          map((data) =>
            DashboardActions.findTransactionsSuccess({ result: data })
          ),
          catchError((error) =>
            of(DashboardActions.findTransactionsFailed({error:error?.error?.errors ?? {}}))
          )
        )
      )
    );
  });

  openNotificationsModalSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.openNotificationsModal),
      tap(_ => this.dialog.open(NotificationsModalSearchComponent)),
    ),
    { dispatch: false }
  );

  openTransactionsModalSearch$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DashboardActions.openTransactionsModal),
        tap(_ => this.dialog.open(TransactionsModalSearchComponent)),
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService,
    private dialog: MatDialog
  ) {}
}
