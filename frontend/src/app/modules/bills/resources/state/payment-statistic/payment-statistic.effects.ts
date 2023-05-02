import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, mergeMap} from 'rxjs/operators';
import * as PaymentStatisticActions from './payment-statistic.actions';
import {Store} from "@ngrx/store";
import {selectCurrentPage} from "../../../../../store/selectors/router.selectors";
import {PaymentStatisticService} from "../../services/payment-statistic.service";
import * as fromRouter from "@ngrx/router-store";
import { selectCurrentTabProperty } from "./payment-statistic.selectors";
import { EMPTY, iif, take } from "rxjs";


@Injectable()
export class PaymentStatisticEffects {

  changeCurrentTabProperties$ = createEffect(
    () => this.actions$.pipe(
      ofType(fromRouter.routerNavigatedAction),
      take(1),
      mergeMap(() => this.store.select(selectCurrentPage).pipe(
        map(currentTab => PaymentStatisticActions.changeTabProperties({currentTab}))
      ))
    )
  )

  loadPaymentStatistics$ = createEffect(
    () => this.actions$.pipe(
      ofType(PaymentStatisticActions.changeTabProperties),
      take(1),
      mergeMap(() => this.store.select(selectCurrentTabProperty).pipe(
        mergeMap(tabProperty =>
          iif(()=>!!tabProperty,
          this.paymentStatisticService.getPaymentStatistics(tabProperty?.type).pipe(
            map(paymentStatistic =>
              PaymentStatisticActions.loadPaymentStatisticsSuccess({paymentStatistic: paymentStatistic})),
          ),
           EMPTY
        )))
      )))

  constructor(private actions$: Actions, private store: Store, private paymentStatisticService: PaymentStatisticService) {
  }
}
