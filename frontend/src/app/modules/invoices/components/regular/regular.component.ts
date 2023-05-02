import { selectUser } from './../../../../store/selectors/auth.selectors';
import { select, Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { TableHeaderCellType } from 'src/app/core/resources/models/TableHeaderCellType';
import { ApprovalStatus } from 'src/app/shared/models/ApprovalStatus';
import { Invoice } from '../../resources/models/Invoice';
import { InvoicesActions } from '../../resources/state/actions/invoices.actions';
import { currentInvoicesEmptySelector, currentInvoicesLoadingSelector, regularInvoicesEmptySelector, regularInvoicesSelector, selectInvoice, shownInvoicesSelector, sortConfigSelector } from '../../resources/state/selectors/invoices.selectors';
import { TableRowCellType } from 'src/app/core/resources/models/TableRowCellType';
import { TableHeaderCell } from 'src/app/core/resources/models/TableHeaderCell';
import { ButtonConfig } from 'src/app/shared/button/button.component';
import { lastValueFrom, take } from 'rxjs';
import { Router } from '@angular/router';
import { AppState } from 'src/app/store';
import { SortDirection } from 'src/app/core/resources/models/SortDirection';
import { RowEvent } from 'src/app/core/resources/models/RowEvent';
import { getRegularIncoices } from '../../resources/state/actions/regular-invoices.actions';

@Component({
  selector: 'app-regular',
  templateUrl: './regular.component.html',
  styleUrls: ['./regular.component.scss']
})
export class RegularComponent implements OnInit {

  
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
    select(regularInvoicesSelector)
  );

  prevHeaderClickId?: number;

  headerCells: TableHeaderCell[] = [
    {
      id: 1,
      order: 1,
      type: TableHeaderCellType.Sort,
      sortName: 'number',
      text: "Invoice No.",
      width: '102px',
      rowType: TableRowCellType.None,
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

  ngAfterViewInit(): void {
    this.headerCells.push({
      id: 7,
      order: 7,
      type: TableHeaderCellType.None,
      text: "",
      width: '90px',
      rowType: TableRowCellType.Menu,
      rowDataName: ['']
    });
  }
  ngOnInit(): void {
    this.store.dispatch(getRegularIncoices());
    this.store.pipe(select(currentInvoicesLoadingSelector)).subscribe(loading => this.isLoading = loading)
    this.store.pipe(select(regularInvoicesEmptySelector)).subscribe(empty => this.isEmpty = empty)
  }

  onDeleteClick() {
    this.store.dispatch(InvoicesActions.deleteInvoice({ invoiceId:this.selectedInvoice!.id!}))
  }
  onArchiveClick() {
    this.store.dispatch(InvoicesActions.archiveInvoice({ id: this.selectedInvoice!.id! }))
  }

  user = this.store.pipe(select(selectUser));
  onContextMenuOpen(invoice: Invoice) {
    this.selectedInvoice = invoice;
  }
  showDetailsDialog(invoice: Invoice) {
    this.store.dispatch(InvoicesActions.openCurrentInvoiceDialog({
      data: {
        
        isEditingMode: invoice.approvalStatus === ApprovalStatus.RequiresUpdates,
        invoice: invoice!,
      },

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
        this.store.dispatch(InvoicesActions.openCurrentInvoiceDialog({
          data: {
            invoice: invoice!,
            isEditingMode:invoice?.approvalStatus === ApprovalStatus.RequiresUpdates,
          }
        }))
      })
    }
  }
}
