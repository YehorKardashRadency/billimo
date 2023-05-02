import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, switchMap, tap, withLatestFrom, concatMap } from 'rxjs';
import { BillService } from '../../services/bill.service';
import * as BillActions from './bill.actions';
import {loadSentBills, openSuccessDialog} from "./bill.actions";
import {PaymentBillSuccessfulComponent} from "../../../modals/payment-bill-successful/payment-bill-successful.component";
import {ModalService} from "../../../../../core/resources/services/modal.service";
import * as BillReducer from './bill.reducer';
import { getSelectedBill, selectParams, selectSelectedSentBillsId } from './bill.selectors';
import {
  CancelScheduledBillComponent
} from "../../../components/cancel-scheduled-bill/cancel-scheduled-bill.component";
import {MatDialog} from "@angular/material/dialog";
import {loadReceivedBills} from "../received/received.bill.actions";


@Injectable()
export class BillEffects {
  getBillPaymentDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BillActions.loadBillPaymentDetails),
      switchMap((action) => {
        return this.billService.getBillPaymentDetails(action.id).pipe(
          map(bill => BillActions.loadBillPaymentDetailsSuccess({ bill })),
          catchError(error => of(BillActions.loadBillPaymentDetailsFailure( { error: error?.error?.errors ?? {}})))
        );
      })
    );
  });

  payBillNow$=createEffect(() => {
    return this.actions$.pipe(
      ofType(BillActions.payBillNow),
      mergeMap((action) => {
        return this.billService.payBillNow(action.payBillDto).pipe(
          map(
            action=>openSuccessDialog(
              {component:PaymentBillSuccessfulComponent, props:action}))
        )
      })
    );
  });

  payBillOnDate$=createEffect(() => {
    return this.actions$.pipe(
      ofType(BillActions.payBillOnDate),
      mergeMap((action) => {
        return this.billService.payBillOnDate(action.payBillDto).pipe(
          map(
            action=>openSuccessDialog(
              {component:PaymentBillSuccessfulComponent, props:action}))
        )
      })
    );
  });

  openModalSuccessful$=createEffect(
    () => {
    return this.actions$.pipe(
      ofType(BillActions.openSuccessDialog),
      map(action =>
        this.modalService.openModal(
          action.component,
          action.props
        )));
  },{dispatch:false})
  redirectToLogin$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(BillActions.navigateToLogin),
        tap(() => this.router.navigate(['/login']))
      );
    },
    { dispatch: false }
  );

  redirectToRegistration$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(BillActions.navigateToRegistration),
        withLatestFrom(this.store.select(getSelectedBill)),
        tap(([action, bill]) => this.router.navigate(['/company-onboarding/registration'], {
          queryParams: {
            email: bill?.buyer.email
          }
        }))
      );
    },
    { dispatch: false }
  );

  persistBillId$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BillActions.persistBillId),
        withLatestFrom(this.store.select(getSelectedBill)),
        tap(([action, bill]) => {
          if (bill) localStorage.setItem('billId', bill.id!.toString());
        })
      ),
    { dispatch: false }
  );

  loadSentBills$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        BillActions.loadSentBills),
      withLatestFrom(this.store.select(selectParams)),
      switchMap(([action, params]) =>
        this.billService.getSentBills(params).pipe(
          map((data) => BillActions.loadSentBillsSuccess({ bills: data })),
          catchError((error) => of(BillActions.loadSentBillsFailure({ error: error?.error?.errors ?? {} })))
        )
      )
    )
  });

  addSelectedSentBills$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        BillActions.addSelectedSendBills),
      withLatestFrom(this.store.select(selectSelectedSentBillsId)),
      concatMap(([action, selectedBills]) => of(BillActions.setSelectedSendBills({selectedBills:[...selectedBills,action.id]}))
      )
    )}
  );

  removeSelectedSentBills$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        BillActions.removeSelectedSendBills),
      withLatestFrom(this.store.select(selectSelectedSentBillsId)),
      concatMap(([action, selectedBills]) => of(BillActions.setSelectedSendBills({selectedBills:selectedBills.filter(x => x !== action.id)})))
    )}
  );

  openCancellationModal$ = createEffect(() =>
      this.actions$.pipe(
        ofType(BillActions.showBillCancellationModal),
        tap(billData => this.dialog.open(CancelScheduledBillComponent,
          {
            data: {id: billData.bill.id, cancellation: billData.bill.billCancellation, tab: billData.tab }
          })),
      ),
    { dispatch: false }
  );

  cancelBill$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BillActions.cancelBill),
      mergeMap((action) =>
        this.billService.cancelBill$(action.model).pipe(
          map((data) =>
            BillActions.cancelBillSuccess({tab: action.tab})
          ),
          catchError((error) =>
            of(BillActions.cancelBillFailed(error))
          )
        )
      )
    );
  });

  closeModalOnSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(BillActions.cancelBillSuccess),
        tap(action => {
            this.dialog.closeAll();
            if (action.tab == 'sent'){
              this.store.dispatch(loadSentBills())
            }else{
              this.store.dispatch(loadReceivedBills())
            }
        }),
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private billService: BillService,
    private router: Router,
    private store: Store<BillReducer.State>,
    private modalService: ModalService,
    private dialog: MatDialog
  ) {}

}
