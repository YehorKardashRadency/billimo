import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { AppState } from 'src/app/store';
import { BillService } from '../../services/bill.service';
import * as BillActions from './received.bill.actions';
import * as BillSelectors from 'src/app/modules/bills/resources/state/received/received.bill.selectors';
import { RequestsBillsActions } from "../requests-bills/requests-bills.actions"
import {MatDialog} from "@angular/material/dialog";
import {
  CancelScheduledBillComponent
} from "../../../components/cancel-scheduled-bill/cancel-scheduled-bill.component";
import * as DashboardActions from "../../../../dashboard/resources/state/dashboard.actions";
import {mergeMap} from "rxjs/operators";

@Injectable()
export class ReceivedBillEffects {
  loadReceivedBills$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        BillActions.loadReceivedBills,
        RequestsBillsActions.approveBillSuccess,
        RequestsBillsActions.createBillRequestSuccess,
        RequestsBillsActions.approveBillSuccess,
        RequestsBillsActions.declineBillSuccess),
      withLatestFrom(this.store.select(BillSelectors.selectParams)),
      switchMap(([action, params]) =>
        this.billService.getReceivedBills(params).pipe(
          map((data) => BillActions.loadReceivedBillsSuccess({ bills: data })),
          catchError((error) => of(BillActions.loadReceivedBillsFailure({ error: '' })))
        )
      )
    )
  });

  payReceivedBill$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(BillActions.paySelectedReceivedBill),
        withLatestFrom(this.store.select(BillSelectors.selectSelectedReceivedBillId)),
        switchMap(([action,id]) => of(BillActions.redirectToPayReceivedBillPage({route:`/bills/received/${id}`})))
      );
    },
  );

  constructor(private actions$: Actions, private billService: BillService,private store: Store<AppState>) {}
}
