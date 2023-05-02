import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as PaymentMethodsActions from './payment-methods.actions';
import {PaymentMethodsService} from "../resources/services/payment-methods.service";
import {catchError, map, mergeMap, tap} from "rxjs/operators";
import {EMPTY, of, switchMap} from "rxjs";
import {PlaidService} from "../../../../../core/resources/services/plaid.service";
import * as DashboardActions from "../../../../dashboard/resources/state/dashboard.actions";
import {
  NotificationsModalSearchComponent
} from "../../../../dashboard/notifications/notifications-modal-search/notifications-modal-search.component";
import {
  PaymentMethodSuccessModalComponent
} from "../payment-method-success-modal/payment-method-success-modal.component";
import {MatDialog} from "@angular/material/dialog";


@Injectable()
export class PaymentMethodsEffects {
  loadActions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentMethodsActions.loadPaymentMethods, PaymentMethodsActions.exchangeLinkTokenSuccess),
      mergeMap((action) => {
        return this.paymentMethodsService.getPaymentMethods$().pipe(
            map((data) =>
              PaymentMethodsActions.loadPaymentMethodsSuccess({result: data})
            ),
            catchError((error) =>
              of(PaymentMethodsActions.loadPaymentMethodsFailure({error:error?.error?.errors ?? {}}))
            )
          )
        }
      )
    );
  });

  changeStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentMethodsActions.createLinkToken),
      switchMap(action =>
        this.plaidService.createLinkToken$().pipe(
        switchMap(res => {
          this.plaidService.createHandler(res.link_token);
          return EMPTY;
        }),
          catchError(error => of(PaymentMethodsActions.createLinkTokenFailure({error:error?.error?.errors ?? {}}))
        )))));

  exchangeToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentMethodsActions.exchangeLinkToken),
      mergeMap((action) =>
        this.plaidService.exchangePublicToken(action.publicToken).pipe(
          map((data) =>
            PaymentMethodsActions.exchangeLinkTokenSuccess()
          ),
          catchError((error) =>
            of(PaymentMethodsActions.exchangeLinkTokenFailure({error:error?.error?.errors ?? {}}))
          )
        )
      )
    );
  });

  openSuccessModal$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PaymentMethodsActions.exchangeLinkTokenSuccess),
        tap(_ => this.dialog.open(PaymentMethodSuccessModalComponent)),
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private paymentMethodsService: PaymentMethodsService,
    private plaidService: PlaidService,
    private dialog: MatDialog
  ) {}
}
