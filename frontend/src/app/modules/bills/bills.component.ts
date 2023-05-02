import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import * as BillActions from 'src/app/modules/bills/resources/state/bill/bill.actions';
import * as ReceivedBillActions from 'src/app/modules/bills/resources/state/received/received.bill.actions';
import { Observable, Subscription, switchMap, take } from 'rxjs';
import * as BillsSelectors from 'src/app/modules/bills/resources/state/bill/bill.selectors';
import * as ReceivedBillsSelectors from 'src/app/modules/bills/resources/state/received/received.bill.selectors';
import { Role } from 'src/app/modules/auth/resources/models/Role';
import { selectRole } from 'src/app/store/selectors/auth.selectors';
import { RequestsBillsActions } from "src/app/modules/bills/resources/state/requests-bills/requests-bills.actions"
import * as requestsBillsSelectors from "src/app/modules/bills/resources/state/requests-bills/requests-bills.selectors"
import { Router } from '@angular/router';
import { BillService } from './resources/services/bill.service';
import { Bill } from './resources/models/bill';
import { ExportedBill } from './resources/models/exported-bill';
import * as Papa from 'papaparse';
import * as BillSelector from 'src/app/modules/bills/resources/state/bill/bill.selectors';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {

  sentBillsCount$: Observable<number> = new Observable();
  receivedBillsCount$: Observable<number> = new Observable();
  requestsTotalCount$: Observable<number> = new Observable();

  hasRequestsAccess = false;
  roleSubscription: Subscription;

  activeTabIndex: number = 0;
  searchValue: string = '';

  selectAll$: Observable<boolean>;
  selectedReceivedBillId$: Observable<number>;
  subscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>,
    private router: Router,
    private billService: BillService) {

    this.roleSubscription = this.store.pipe(select(selectRole), take(1)).subscribe(role => {
      this.hasRequestsAccess = role == Role.Admin || role == Role.Director;
    })

    this.selectedReceivedBillId$ = this.store.select(ReceivedBillsSelectors.selectSelectedReceivedBillId)      
    this.selectAll$ = this.store.select(BillSelector.selectSelectedAllSentBills);
  }

  ngOnInit(): void {
    this.sentBillsCount$ = this.store.select(BillsSelectors.selectSentBillsTotalCount);
    this.receivedBillsCount$ = this.store.select(ReceivedBillsSelectors.selectReceivedBillsTotalCount);
    this.requestsTotalCount$ = this.store.select(requestsBillsSelectors.selectRequestsBillsTotalCount);
    this.store.dispatch(BillActions.loadSentBills());
    this.store.dispatch(ReceivedBillActions.loadReceivedBills());
    this.store.dispatch(RequestsBillsActions.loadRequestsBills());

    const activeTabTitle = this.router.url.split('/').pop() as string;
    this.activeTabIndex = activeTabTitle === 'sent' ? 0 : (activeTabTitle === 'received' ? 1 : 2)
  }

  ngOnDestroy(): void {
    this.roleSubscription.unsubscribe();
    this.subscription.unsubscribe();
  }

  exportAll() {
    this.subscription.add(
      this.store.select(BillsSelectors.selectParams).pipe(
        switchMap((params) => this.billService.getExportedBills(params)),
        take(1)
      ).subscribe({
        next: (data) => this.saveAsCsv(data)
      }));
  }

  exportSelected() {
    this.subscription.add(
      this.store.select(BillsSelectors.selectSelectedSentBills).pipe(
        take(1))
        .subscribe({
          next: (bills) => this.saveAsCsv(this.convertToExportedBill(bills))
        }));
  }

  convertToExportedBill(bills: Bill[]): ExportedBill[] {
    return bills.map(x => ({
      id: x.id,
      invoiceId: x.invoiceId,
      invoiceNumber: x.invoiceNumber,
      dueDate: x.dueDate,
      createdDate: x.createdDate,
      paymentMethod: x.paymentMethod,
      PaymentMethodId: x.PaymentMethodId,
      status: x.status,
      companyName: x.companyName,
      companyId: x.companyId,
      amount: x.amount,
      currency: x.currency
    }));
  }

  saveAsCsv(data: Array<ExportedBill>) {
    const csvString = Papa.unparse(data);
    const csvData = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const downloadLink = document.createElement('a');
    const url = URL.createObjectURL(csvData);
    downloadLink.setAttribute('href', url);
    downloadLink.setAttribute('download', 'sent bills.csv');
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  payTheBill() {
    this.store.dispatch(ReceivedBillActions.paySelectedReceivedBill());
  }

  newSearch(input: string): void {
    this.searchValue = input;
    if (this.activeTabIndex === 0) {
      this.store.dispatch(BillActions.searchSentBills({ search: input === '' ? null : input }));
      this.store.dispatch(BillActions.loadSentBills());
    } else if (this.activeTabIndex === 1) {
      this.store.dispatch(ReceivedBillActions.searchReceivedBills({ search: input === '' ? null : input }));
      this.store.dispatch(ReceivedBillActions.loadReceivedBills());
    } else if (this.activeTabIndex === 2) {
      this.store.dispatch(RequestsBillsActions.searchRequestsBills({ search: input === '' ? null : input }));
      this.store.dispatch(RequestsBillsActions.loadRequestsBills());
    }
  }

  activeTabChange(event: number) {
    this.activeTabIndex = event;
    if (this.activeTabIndex === 0){
      this.store.dispatch(BillActions.clearSentBillsFilter());
      this.store.dispatch(BillActions.clearSentBillsSort());
      this.store.dispatch(BillActions.searchSentBills({ search: this.searchValue === '' ? null : this.searchValue }));
      this.store.dispatch(BillActions.loadSentBills());
    }
    if (this.activeTabIndex === 1) {
      this.store.dispatch(ReceivedBillActions.clearReceivedBillsFilter());
      this.store.dispatch(ReceivedBillActions.clearReceivedBillsSort());
      this.store.dispatch(ReceivedBillActions.searchReceivedBills({ search: this.searchValue === '' ? null : this.searchValue }));
      this.store.dispatch(ReceivedBillActions.loadReceivedBills());
    }
  }
}
