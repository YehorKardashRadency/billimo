import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { lastValueFrom, take } from 'rxjs';
import { RowEvent } from 'src/app/core/resources/models/RowEvent';
import { SortDirection } from 'src/app/core/resources/models/SortDirection';
import { TableHeaderCell } from 'src/app/core/resources/models/TableHeaderCell';
import { TableHeaderCellType } from 'src/app/core/resources/models/TableHeaderCellType';
import { TableRowCellType } from 'src/app/core/resources/models/TableRowCellType';
import { InvoicesActions } from 'src/app/modules/invoices/resources/state/actions/invoices.actions';
import { AppState } from 'src/app/store';
import { selectUser } from 'src/app/store/selectors/auth.selectors';
import { Invoice } from '../../resources/models/Invoice';
import { RequestsInvoicesActions } from '../../resources/state/actions/requests-invoices.actions';
import { currentInvoicesLoadingSelector, requestsInvoicesLengthSelector, selectInvoice, shownRequestsInvoicesSelector, sortConfigSelector } from '../../resources/state/selectors/invoices.selectors';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

  constructor(private store: Store<AppState>, readonly router: Router) {
    lastValueFrom(this.store.pipe(select(sortConfigSelector), take(1))).then(config => {
      if (config.sortByProp != undefined) {
        const headerIndex = this.headerCells.findIndex(cell => cell.sortName == config.sortByProp);
        this.headerCells[headerIndex].value = config.sortAscending ? SortDirection.ascending : SortDirection.descending;
      }
    })
  }

  isEmpty = false;
  isLoading = true;
  selectedInvoice: Invoice | null = null;
  invoices$ = this.store.pipe(
    select(shownRequestsInvoicesSelector),
  );

  prevHeaderClickId?: number;

  @ViewChild('menu', { static: true }) menuRef!: MatMenu;

  headerCells: TableHeaderCell[] = [
    {
      id: 1,
      order: 1,
      type: TableHeaderCellType.Sort,
      sortName: 'number',
      text: "Invoice No.",
      width: '102px',
      rowType: TableRowCellType.Invoice,
      rowDataName: ['number']
    },
    {
      id: 2,
      order: 2,
      type: TableHeaderCellType.Sort,
      sortName: 'dueDate',
      text: "Due Date",
      width: '166px',
      rowType: TableRowCellType.TwoFlors,
      rowDataName: ['dueDate', 'createdDate']
    },
    {
      id: 3,
      order: 3,
      type: TableHeaderCellType.Sort,
      sortName: 'company.name',
      text: "Company",
      width: '146px',
      rowType: TableRowCellType.WithLogo,
      rowDataName: ['company.logo', 'company.name']
    },
    {
      id: 4,
      order: 4,
      type: TableHeaderCellType.Sort,
      sortName: 'total',
      text: "Amount",
      width: '136px',
      maxWidth: '136px',
      rowType: TableRowCellType.WithCurrency,
      rowDataName: ['total', 'currency']
    },
    {
      id: 5,
      order: 5,
      type: TableHeaderCellType.Sort,
      sortName: 'category',
      text: "Category",
      width: '156px',
      rowType: TableRowCellType.None,
      rowDataName: ['category']
    },
    {
      id: 6,
      order: 6,
      type: TableHeaderCellType.None,
      text: "Status",
      width: '90px',
      rowType: TableRowCellType.Status,
      rowDataName: ['approvalStatus']
    }
  ]


  ngOnInit(): void {
    this.headerCells.push({
      id: 7,
      order: 7,
      type: TableHeaderCellType.None,
      text: "",
      width: '90px',
      rowType: TableRowCellType.Menu,
      menuRef: this.menuRef,
      rowDataName: ['']
    });
    this.isLoading = true;
    this.store.pipe(select(requestsInvoicesLengthSelector)).subscribe(length => {
      this.isEmpty = length == 0;
    })
    this.store.pipe(select(currentInvoicesLoadingSelector)).subscribe(loading => this.isLoading = loading)
    lastValueFrom(this.store.pipe(select(sortConfigSelector), take(1))).then(config => {
      if (config.sortByProp != undefined) {
        const headerIndex = this.headerCells.findIndex(cell => cell.sortName == config.sortByProp);
        this.headerCells[headerIndex].isSortAscending = config.sortAscending;
        this.headerCells[headerIndex].isSortDescending = !config.sortAscending;
      }
    })
  }
  onDeleteClick() {
    this.store.dispatch(InvoicesActions.deleteInvoice({ invoiceId: this.selectedInvoice!.id! }))
  }
  onArchiveClick() {
    this.store.dispatch(InvoicesActions.archiveInvoice({ id: this.selectedInvoice!.id! }))
  }

  user = this.store.pipe(select(selectUser));
  onContextMenuOpen(invoice: Invoice) {
    this.selectedInvoice = invoice;
  }
  showDetailsDialog(invoice: Invoice) {
    this.store.dispatch(RequestsInvoicesActions.openRequestsInvoiceDialog({
      data: {
        invoice: invoice!,
      }
    }))
  }
  headerClick(cellId: number) {
    if (this.headerCells.find(x => x.id === cellId)?.type === TableHeaderCellType.Sort) {
      var sortCell = this.headerCells.find(x => x.type === TableHeaderCellType.Sort && x.value !== null);

      if (!sortCell || !sortCell.sortName) {
        return;
      }
      if (cellId != this.prevHeaderClickId)
        this.store.dispatch(InvoicesActions.setSortProp({ prop: sortCell.sortName }));
      else
        this.store.dispatch(InvoicesActions.toggleSortOrder());
      this.prevHeaderClickId = cellId;
    }
  }
  rowClick(rowEvent: RowEvent) {
    if (rowEvent.cellIndex == 7) {
      lastValueFrom(this.store.pipe(select(selectInvoice(rowEvent.entityId)), take(1))).then((invoice) => {
        this.selectedInvoice = invoice!;
      })
    }
    else {
      lastValueFrom(this.store.pipe(select(selectInvoice(rowEvent.entityId)), take(1))).then(invoice => {
        this.showDetailsDialog(invoice!);
      })
    }

  }
}
