import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as BillReducer from '../resources/state/bill/bill.reducer';
import { getSelectedBill } from '../resources/state/bill/bill.selectors';
import { Bill } from '../resources/models/bill.model';
import * as BillActions from '../resources/state/bill/bill.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-public-pay-bill',
  templateUrl: './public-pay-bill.component.html',
  styleUrls: ['./public-pay-bill.component.scss'],
})
export class PublicPayBillComponent implements OnInit {
  selectedBill$?: Observable<Bill | null>;

  constructor(private store: Store<BillReducer.State>) {}

  ngOnInit() {
    this.selectedBill$ = this.store.pipe(select(getSelectedBill));
    this.store.dispatch(BillActions.persistBillId());
  }

  login() {
    this.store.dispatch(BillActions.navigateToLogin());
  }

  register() {
    this.store.dispatch(BillActions.navigateToRegistration());
  }
}
