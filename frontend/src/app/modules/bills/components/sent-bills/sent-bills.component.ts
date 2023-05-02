import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from 'src/app/store';
import { BillStatus } from '../../resources/models/bill-status';
import * as BillActions from 'src/app/modules/bills/resources/state/bill/bill.actions';
import { select, Store } from '@ngrx/store';
import { TableHeaderCell } from 'src/app/core/resources/models/TableHeaderCell';
import { TableHeaderCellType } from 'src/app/core/resources/models/TableHeaderCellType';
import { SortDirection } from 'src/app/core/resources/models/SortDirection';
import { Filter } from 'src/app/core/resources/models/Filter';
import { Sort } from 'src/app/core/resources/models/Sort';
import { FilterType } from 'src/app/core/resources/models/FilterType';
import { TableRowCellType } from 'src/app/core/resources/models/TableRowCellType';
import { Bill } from '../../resources/models/bill';
import { Observable } from 'rxjs';
import * as BillSelector from 'src/app/modules/bills/resources/state/bill/bill.selectors';
import { RowEvent } from 'src/app/core/resources/models/RowEvent';
import { PaginatedList } from 'src/app/shared/models/PaginatedList';
import {showBillCancellationModal} from "src/app/modules/bills/resources/state/bill/bill.actions";

@Component({
  selector: 'app-sent-bills',
  templateUrl: './sent-bills.component.html',
  styleUrls: ['./sent-bills.component.scss']
})
export class SentBillsComponent implements OnInit {

  filterSet: string[] = [];
  headerCells: TableHeaderCell[] = [];
  billsWithPagination$:Observable<PaginatedList<Bill> | null> = new Observable();
  selectAll$: Observable<boolean>;
  pageSize$: Observable<number>;

  constructor(
    private store: Store<AppState>
  ) {
    this.pageSize$ = this.store.select(BillSelector.selectPageSize);
    this.selectAll$ = this.store.select(BillSelector.selectSelectedAllSentBills);
  }

  ngOnInit(): void {
    this.filterSet.push("All");
    Object.values(BillStatus).forEach(x => this.filterSet.push(x));
    this.setHeaderCellSet();
    this.billsWithPagination$ = this.store.pipe(select(BillSelector.selectSentBillsWithPaginator));
  }

  changeFilter(event: number) {
    var filter: Filter[] = [];
    if (event) {
      filter.push({ key: 'status', value: Object.keys(BillStatus)[event - 1], filterType: FilterType.equals });
    }
    this.store.dispatch(BillActions.setFilterSentBills({ filter: filter }));
    this.store.dispatch(BillActions.loadSentBills());
  }

  headerClick(cellId: number) {
    var sort: Sort[] = [];
    if (this.headerCells.find(x => x.id === cellId)?.type === TableHeaderCellType.Sort) {
      var sortCell = this.headerCells.find(x => x.type === TableHeaderCellType.Sort && x.value !== null);
      if (!sortCell || !sortCell.sortName) {
        return;
      }
      sort.push({ field: sortCell.sortName, direction: sortCell.value });
      this.store.dispatch(BillActions.setSortSentBills({ sort: sort }));
      this.store.dispatch(BillActions.loadSentBills());
    }

    if (this.headerCells.find(x => x.id === cellId)?.type === TableHeaderCellType.CheckBox) {
      this.store.dispatch(BillActions.selectedAllSentBills());
    }
  }

  toPage(page: number): void {
    this.store.dispatch(BillActions.setPageIndexSentBills({pageIndex:page-1}));
    this.store.dispatch(BillActions.loadSentBills());
  }

  rowClick(rowEvent: RowEvent) {
    if (this.headerCells.find(x => x.id === rowEvent.cellIndex)?.type == TableHeaderCellType.CheckBox) {
      this.setSelectedSendBills(rowEvent);
    }
  }

  setSelectedSendBills(rowEvent: RowEvent) {
    if (rowEvent.value) {
      this.store.dispatch(BillActions.addSelectedSendBills({id:rowEvent.entityId}));
    }
    else{
      this.store.dispatch(BillActions.removeSelectedSendBills({id:rowEvent.entityId}));
    }
  }

  setHeaderCellSet() {
    this.headerCells.push({
      id: 0,
      order: 0,
      type: TableHeaderCellType.CheckBox,
      value: false,
      width: '24px',
      rowType: TableRowCellType.CheckBox,
      rowDataName: []
    },
      {
        id: 1,
        order: 1,
        type: TableHeaderCellType.Sort,
        sortName: 'number',
        text: "Invoice No.",
        width: '102px',
        rowType: TableRowCellType.Invoice,
        rowDataName: ['invoiceNumber']
      },
      {
        id: 2,
        order: 2,
        type: TableHeaderCellType.Sort,
        sortName: 'date',
        text: "Due Date",
        width: '166px',
        value: SortDirection.descending,
        rowType: TableRowCellType.TwoFlors,
        rowDataName: ['dueDate', 'createdDate']
      },
      {
        id: 3,
        order: 3,
        type: TableHeaderCellType.Sort,
        sortName: 'companyName',
        text: "Company",
        width: '222px',
        rowType: TableRowCellType.WithLogo,
        rowDataName: ['companyLogo', 'companyName']
      },
      {
        id: 4,
        order: 4,
        type: TableHeaderCellType.Sort,
        sortName: 'amount',
        text: "Amount",
        width: '136px',
        maxWidth: '136px',
        rowType: TableRowCellType.WithCurrency,
        rowDataName: ['amount', 'currency']
      },
      {
        id: 5,
        order: 5,
        type: TableHeaderCellType.None,
        text: "Status",
        width: '120px',
        rowType: TableRowCellType.Status,
        rowDataName: ['status']
      },
      {
        id: 6,
        order: 6,
        type: TableHeaderCellType.None,
        text: "Payment method",
        width: '120px',
        rowType: TableRowCellType.None,
        rowDataName: ['paymentMethod']
      }
    )
  }

  selectedBill?: Bill

  selectBil(row: Bill) {
    this.selectedBill = row;
  }

  cancel() {
    if (this.selectedBill){
      this.store.dispatch(showBillCancellationModal({bill: this.selectedBill, tab: 'sent'}))
      console.log(this.selectedBill);
    }
  }

}
