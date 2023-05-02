import { Component, OnInit } from '@angular/core';
import {Transaction} from "../resources/models/transaction.model";
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import * as DashboardReducer from "../resources/state/dashboard.reducer";
import * as DashboardSelector from "../resources/state/dashboard.selectors";
import * as fromDashboardActions from "../resources/state/dashboard.actions";
import {PaginatedList} from "../../../shared/models/PaginatedList";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  transactions$?: Observable<PaginatedList<Transaction> | null>;

  constructor(private store: Store<DashboardReducer.State>) {}

  ngOnInit() {
    this.transactions$ = this.store.pipe(select(DashboardSelector.selectTransactions));
    this.store.dispatch(fromDashboardActions.loadTransactions({ take: 4 }));
  }

  viewAll(){
    this.store.dispatch(fromDashboardActions.openTransactionsModal());
  }
}
