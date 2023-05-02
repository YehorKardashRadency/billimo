import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SortDirection } from 'src/app/core/resources/models/SortDirection';
import { TableHeaderCell } from 'src/app/core/resources/models/TableHeaderCell';
import { TableHeaderCellType } from 'src/app/core/resources/models/TableHeaderCellType';
import { TableRowCellType } from 'src/app/core/resources/models/TableRowCellType';
import { AppState } from 'src/app/store';
import { Bill } from '../../resources/models/bill';
import * as fromRequestsBillsSelectors from "src/app/modules/bills/resources/state/requests-bills/requests-bills.selectors"
import { RequestsBillsActions } from "src/app/modules/bills/resources/state/requests-bills/requests-bills.actions"
import { Observable, Subscription } from 'rxjs';
import { PaginatedList } from 'src/app/shared/models/PaginatedList';
import { Sort } from 'src/app/core/resources/models/Sort';
import { RowEvent } from 'src/app/core/resources/models/RowEvent';
import * as fromBillActions from '../../resources/state/bill/bill.actions';
import { PopupDataModel } from '../../resources/models/PopupDataModel';

@Component({
  selector: 'app-requests-bills',
  templateUrl: './requests-bills.component.html',
  styleUrls: ['./requests-bills.component.scss']
})
export class RequestsBillsComponent implements OnInit {
  filterSet: string[] = [];
  isEmpty = false;
  isLoading = true;
  bills$!: Observable<PaginatedList<Bill> | null>;
  pageSize$: Observable<number>;

  billsRequestsCells: TableHeaderCell[] = [];

  sortByCompany: ({ isDescending: boolean; title: string })[] = [
    {title: "All Companies", isDescending: false},
  ];

  sortBy: ({ isDescending: boolean; value: string, title: string })[] = [
    {title: "Name (A-Z)", value: 'companyName', isDescending: false},
    {title: "Name (Z-A)", value: 'companyName', isDescending: true},
    {title: "From recent to old", value: 'date', isDescending: true},
    {title: "From old to recent", value: 'date', isDescending: false},
  ];

  constructor(private store: Store<AppState>) {
    this.pageSize$ = this.store.select(fromRequestsBillsSelectors.selectPageSize);
  }

  ngOnInit() {
    this.isLoading = true;
    this.store.pipe(select(fromRequestsBillsSelectors.requestsLoadingSelector)).subscribe(loading => this.isLoading = loading);

    this.store.pipe(select(fromRequestsBillsSelectors.requestsBillsLengthSelector)).subscribe(length => {
      this.isEmpty = length == 0;
    });

    this.setHeaderCellSet();

    this.bills$ = this.store.select(fromRequestsBillsSelectors.selectRequestsBillssWithPaginator);
  }

  headerClick(cellId: number) {
    var sort: Sort[] = [];
    if (this.billsRequestsCells.find(x => x.id === cellId)?.type === TableHeaderCellType.Sort) {
      var sortCell = this.billsRequestsCells.find(x => x.type === TableHeaderCellType.Sort && x.value !== null);
      if (!sortCell || !sortCell.sortName) {
        return;
      }
      sort.push({ field: sortCell.sortName, direction: sortCell.value });
      this.setSort(sort);
    }
  }

  onSorterClick(selectedSorter: any) {
    var sort: Sort[] = [];
    var direction = selectedSorter.isDescending ? SortDirection.descending : SortDirection.ascending;
    sort.push({ field: selectedSorter.value, direction: direction})
    this.setSort(sort);
  }

  setSort(sort: Sort[]) {
    this.store.dispatch(RequestsBillsActions.setSortRequestsBills({ sort: sort }));
    this.store.dispatch(RequestsBillsActions.loadRequestsBills());
  }

  onRowClick(event: RowEvent) {
    this.store.dispatch(fromBillActions.loadBillPaymentDetails({ id: event.entityId }));

    var data: PopupDataModel = {
      billId: event.entityId,
      title: 'Bill',
    }
    this.store.dispatch(RequestsBillsActions.openRequestsBillDialog({
      data: data
    }))
  }

  toPage(page: number): void {
    this.store.dispatch(RequestsBillsActions.setPageIndexRequestsBills({ pageIndex: page - 1 }));
    this.store.dispatch(RequestsBillsActions.loadRequestsBills());
  }

  setHeaderCellSet() {
    this.billsRequestsCells.push(
      {
        id: 1,
        order: 1,
        type: TableHeaderCellType.Sort,
        sortName: 'number',
        width:'126px',
        text:'Invoice No.',
        rowType: TableRowCellType.Invoice,
        rowDataName: ['invoiceNumber']
      },
      {
        id: 2,
        order: 2,
        type: TableHeaderCellType.Sort,
        value: SortDirection.descending,
        sortName: 'date',
        width: '150px',
        text: 'Due Date',
        rowType: TableRowCellType.TwoFlors,
        rowDataName: ['dueDate', 'createdDate']
      },
      {
        id: 3,
        order: 3,
        type: TableHeaderCellType.Sort,
        sortName: 'companyName',
        width:'222px',
        text:'Company Vendor',
        rowType: TableRowCellType.WithLogo,
        rowDataName: ['companyLogo', 'companyName']
      },
      {
        id: 4,
        order: 4,
        type: TableHeaderCellType.Sort,
        sortName: 'amount',
        width: '120px',
        text: 'Amount',
        rowType: TableRowCellType.WithCurrency,
        rowDataName: ['amount', 'currency']
      },
      {
        id: 5,
        type: TableHeaderCellType.None,
        order: 5,
        width: '154px',
        text: 'Category',
        rowType: TableRowCellType.None,
        rowDataName: ['category']
      },
      {
        id: 6,
        type: TableHeaderCellType.None,
        order: 6,
        width: '170px',
        text: 'Payment Method',
        rowType: TableRowCellType.None,
        rowDataName: ['paymentMethod']
      },
    )
  }
}
