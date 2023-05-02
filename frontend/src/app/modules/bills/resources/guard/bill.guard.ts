import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { catchError, filter, Observable, of, switchMap, take, tap } from 'rxjs';
import * as BillReducer from "../state/bill/bill.reducer";
import { getSelectedBill } from '../state/bill/bill.selectors';
import * as fromBillActions from "../state/bill/bill.actions";

@Injectable({
  providedIn: 'root'
})
export class BillGuard implements CanActivate {

  constructor(private store: Store<BillReducer.State>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const billId = +route.paramMap.get('billId')!!;
    return this.store.pipe(
      select(getSelectedBill),
      tap((bill) => {
        if (!bill) {
          this.store.dispatch(fromBillActions.loadBillPaymentDetails({ id: billId!! }));
        }
      }),
      filter((bill) => !!bill && bill.id === billId),
      take(1),
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }
}
