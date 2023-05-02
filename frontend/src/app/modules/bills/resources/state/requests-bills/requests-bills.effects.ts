import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { map, catchError, of, switchMap, withLatestFrom, tap, mergeMap, lastValueFrom, take } from "rxjs";
import { AppState } from "src/app/store";
import { RequestsBillsActions } from "./requests-bills.actions"
import * as BillSelectors from 'src/app/modules/bills/resources/state/requests-bills/requests-bills.selectors';
import { BillService } from "../../services/bill.service";
import { ButtonConfig } from "src/app/shared/button/button.component";
import { PopupDataModel } from "../../models/PopupDataModel";
import { MatDialog } from "@angular/material/dialog";
import { BillPopupComponent } from "../../../components/bill-popup/bill-popup.component";
import { BillRequestConfirmComponent, RequestConfirmData } from "../../../components/bill-request-confirm/bill-request-confirm.component";
import { SuccessModalRedirectComponent, SuccessModalRedirectData } from "src/app/shared/success-modal-redirect/success-modal-redirect.component";
import { FailedModalRedirectComponent, FailedModalRedirectData } from "src/app/shared/failed-modal-redirect/failed-modal-redirect.component";
import { getSelectedBillNumber, getSelectedBill } from '../bill/bill.selectors';
import { data } from "autoprefixer";


@Injectable()
export class RequestsBillsEffects {
  loadRequestsBills$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        RequestsBillsActions.loadRequestsBills,
        RequestsBillsActions.createBillRequestSuccess,
        RequestsBillsActions.approveBillSuccess,
        RequestsBillsActions.declineBillSuccess),
      withLatestFrom(this.store.select(BillSelectors.selectParams)),
      switchMap(([action, params]) =>
        this.billService.getRequestsBills(params).pipe(
          map((bills) => RequestsBillsActions.loadRequestsBillsSuccess({ requestsBills: bills })),
          catchError((error) => of(RequestsBillsActions.loadRequestsBillsFailure({ error: error?.error?.errors ?? {} })))
        )
      )
    );
  })

  createBillRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RequestsBillsActions.createBillRequest),
      switchMap((action) =>
        this.billService.createBillRequest(action.billId).pipe(
          map(() => RequestsBillsActions.createBillRequestSuccess()),
          catchError((error) => of(RequestsBillsActions.createBillRequestFailure({ error: error?.error?.errors ?? {} })))
        )
      )
    );
  })

  requestsBillDialogOpen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestsBillsActions.openRequestsBillDialog),
      tap(async (action) => {
        this.dialog.closeAll();
        //const billNumber = this.store.select(getSelectedBillNumber);

        const billNumber = await lastValueFrom(this.store.pipe(select(getSelectedBillNumber),take(1)));

        const decline = () => {
          this.store.dispatch(RequestsBillsActions.declineBill({ id: action.data.billId }));
        };
        const approve = () => {
          this.store.dispatch(RequestsBillsActions.openRequestsBillConfirmDialog({ data: action.data, billNumber: billNumber }));
        };

        const approveButtonConfig: ButtonConfig = {text: 'Approve Bill', onClick: () => approve()};
        const declineButtonConfig: ButtonConfig = {text:'Decline', onClick: () => decline()};

        const data: PopupDataModel = {
          billId: action.data.billId,
          title: 'Bill',
          primaryButton: approveButtonConfig,
          declineButton: declineButtonConfig
        }

        const dialogRef = this.dialog.open(BillPopupComponent, {
          data
        });
      })
    ), { dispatch: false })

  requestsBillDialogConfirmOpen$ = createEffect(() =>
  this.actions$.pipe(
    ofType(RequestsBillsActions.openRequestsBillConfirmDialog),
    tap((action) => {
      this.dialog.closeAll();

      const approve = () => {
        this.store.dispatch(RequestsBillsActions.approveBill({ id: action.data.billId, billNumber: action.billNumber }));
      };
      const decline = () => {
        this.store.dispatch(RequestsBillsActions.declineBill({ id: action.data.billId }));
      };

      const approveButtonConfig: ButtonConfig = { text: 'Approve', onClick: () => approve() }
      const declineButtonConfig: ButtonConfig = { text: 'Decline', onClick: () => decline() }

      const data: RequestConfirmData = {
        title: `Are you sure you want to approve Bill ${action.billNumber}?`,
        primaryButton: approveButtonConfig,
        declineButton: declineButtonConfig
      }
      const dialogRef = this.dialog.open(BillRequestConfirmComponent, {
        data
      });
    })
  ), { dispatch: false })

  approveBill$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RequestsBillsActions.approveBill),
      mergeMap((action) =>
        this.billService.approvePendingBill(action.id).pipe(
          map(() => RequestsBillsActions.approveBillSuccess({ number: action.billNumber ?? '' })),
          catchError((error) => of(RequestsBillsActions.approveBillFailure({ error: error?.error?.errors ?? {} })))
        )
      )
    );
  });

  declineBill$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RequestsBillsActions.declineBill),
      tap(() => this.dialog.closeAll()),
      mergeMap((action) =>
         this.billService.declinePendingBill(action.id).pipe(
           map(() => RequestsBillsActions.declineBillSuccess()),
          catchError((error) => of(RequestsBillsActions.declineBillFailure({ error: error?.error?.errors ?? {} })))
        )
      )
    );
  });

  openSuccessulApproveModal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RequestsBillsActions.approveBillSuccess),
      tap((action) => {
        this.dialog.closeAll();
        const data: SuccessModalRedirectData = {
          text: `Bill ${action.number} has been successfully approved. Your managers are able to pay the bill now.`,
          primaryButton: {
            label: 'Go to Recieved',
            route: '/bills/received'
          }
        }
        this.dialog.open(SuccessModalRedirectComponent, { data })
      })
    );
  }, { dispatch: false });

  openFailedApproveModal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RequestsBillsActions.approveBillFailure),
      tap(() => {
        this.dialog.closeAll();
        const data: FailedModalRedirectData = {
          primaryButton: {
            label: 'Go to Recieved',
            route: '/bills/received'
          }
        }
        this.dialog.open(FailedModalRedirectComponent, { data })
      })
    );
  }, { dispatch: false });

  constructor(private actions$: Actions,
    private billService: BillService,
    private store: Store<AppState>,
    private dialog: MatDialog) { }
}
