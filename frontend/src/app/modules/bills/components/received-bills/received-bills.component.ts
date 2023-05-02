import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TableHeaderCell } from 'src/app/core/resources/models/TableHeaderCell';
import { PaginatedList } from 'src/app/shared/models/PaginatedList';
import { AppState } from 'src/app/store';
import { BillStatus } from '../../resources/models/bill-status';
import { ReceivedBill } from '../../resources/models/received.bill';
import * as BillActions from 'src/app/modules/bills/resources/state/received/received.bill.actions';
import * as BillSelector from 'src/app/modules/bills/resources/state/received/received.bill.selectors';
import { Filter } from 'src/app/core/resources/models/Filter';
import { FilterType } from 'src/app/core/resources/models/FilterType';
import { Sort } from 'src/app/core/resources/models/Sort';
import { TableHeaderCellType } from 'src/app/core/resources/models/TableHeaderCellType';
import { RowEvent } from 'src/app/core/resources/models/RowEvent';
import { TableRowCellType } from 'src/app/core/resources/models/TableRowCellType';
import { SortDirection } from 'src/app/core/resources/models/SortDirection';
import {MatMenu} from "@angular/material/menu";
import {showBillCancellationModal} from "../../resources/state/bill/bill.actions";

@Component({
  selector: 'app-received-bills',
  templateUrl: './received-bills.component.html',
  styleUrls: ['./received-bills.component.scss']
})
export class ReceivedBillsComponent implements OnInit, AfterViewInit {

  filterSet: string[] = [];
  headerCells: TableHeaderCell[] = [];
  billsWithPagination$:Observable<PaginatedList<ReceivedBill> | null> = new Observable();
  pageSize$: Observable<number>;
  @ViewChild('menu', { static: true }) menuRef!: MatMenu;

  constructor(
    private store: Store<AppState>
  ) {
    this.pageSize$ = this.store.select(BillSelector.selectPageSize);
  }

  ngOnInit(): void {
    this.filterSet.push("All");
    Object.values(BillStatus).forEach(x => this.filterSet.push(x));
    this.setHeaderCellSet();
    this.billsWithPagination$ = this.store.pipe(select(BillSelector.selectReceivedBillsWithPaginator));
  }

  ngAfterViewInit(): void {
    console.log(this.headerCells);

  }

  changeFilter(event: number) {
    var filter: Filter[] = [];
    if (event) {
      filter.push({ key: 'status', value: Object.keys(BillStatus)[event - 1], filterType: FilterType.equals });
    }
    this.store.dispatch(BillActions.setFilterReceivedBills({ filter: filter }));
    this.store.dispatch(BillActions.loadReceivedBills());
  }

  headerClick(cellId: number) {
    var sort: Sort[] = [];
    if (this.headerCells.find(x => x.id === cellId)?.type === TableHeaderCellType.Sort) {
      var sortCell = this.headerCells.find(x => x.type === TableHeaderCellType.Sort && x.value !== null);
      if (!sortCell || !sortCell.sortName) {
        return;
      }
      sort.push({ field: sortCell.sortName, direction: sortCell.value });
      this.store.dispatch(BillActions.setSortReceivedBills({ sort: sort }));
      this.store.dispatch(BillActions.loadReceivedBills());
    }
  }

  toPage(page: number): void {
    this.store.dispatch(BillActions.setPageIndexReceivedBills({pageIndex:page-1}));
    this.store.dispatch(BillActions.loadReceivedBills());
  }

  rowClick(rowEvent: RowEvent) {
    if (this.headerCells.find(x => x.id === rowEvent.cellIndex)?.type == TableHeaderCellType.Radio) {
      this.setSelectedReceivedBill(rowEvent);
    }
  }

  setSelectedReceivedBill(rowEvent: RowEvent) {
    if (rowEvent.value) {
      this.store.dispatch(BillActions.setSelectedReceivedBillId({id:rowEvent.entityId}));
    }
  }

  setHeaderCellSet() {
    this.headerCells.push({
      id: 0,
      order: 1,
      type: TableHeaderCellType.Radio,
      width: '32px',
      rowType: TableRowCellType.Radio,
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
        width: '100px',
        rowType: TableRowCellType.Status,
        rowDataName: ['status']
      },
      {
        id: 6,
        order: 6,
        type: TableHeaderCellType.None,
        text: "Approval Status",
        width: '120px',
        rowType: TableRowCellType.Status,
        rowDataName: ['approvalStatus']
      },
      {
        id: 7,
        order: 7,
        type: TableHeaderCellType.None,
        text: "Payment method",
        width: '120px',
        rowType: TableRowCellType.None,
        rowDataName: ['paymentMethod']
      }
    )
  }

  selectedBill?: ReceivedBill

  selectBil(row: ReceivedBill) {
    this.selectedBill = row;
  }

  cancel() {
    if (this.selectedBill){
      this.store.dispatch(showBillCancellationModal({bill: this.selectedBill, tab: 'received'}))
      console.log(this.selectedBill);
    }
  }
}
