import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { select, Store } from '@ngrx/store';
import { lastValueFrom, map, Observable, take } from 'rxjs';
import { RowEvent } from 'src/app/core/resources/models/RowEvent';
import { TableHeaderCell } from 'src/app/core/resources/models/TableHeaderCell';
import { TableHeaderCellType } from 'src/app/core/resources/models/TableHeaderCellType';
import { TableRowCellType } from 'src/app/core/resources/models/TableRowCellType';
import { AppState } from 'src/app/store';
import { Invoice } from '../../resources/models/Invoice';
import { ArchivedInvoicesActions } from '../../resources/state/actions/archived-invoices.actions';
import { InvoicesActions } from '../../resources/state/actions/invoices.actions';
import { archivedInvoicesEmptySelector, archivedLoadingSelector, exportedInvoicesSelector } from '../../resources/state/selectors/archived-invoices.selectors';
import { shownArchivedInvoicesSelector, selectArchivedInvoice } from './../../resources/state/selectors/archived-invoices.selectors';
@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  archivedInvoices$!: Observable<Invoice[]>;
  isEmpty$!: Observable<boolean>;
  isLoading = true;
  isParentChecked = false;
  selectAll = false;
  prevHeaderClickId?: number;

  @ViewChild('menu', { static: true }) menuRef!: MatMenu;
  headerCells: TableHeaderCell[] = [
    {
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
    }
  ]

  ngAfterViewInit(): void {
  }
  exportedInvoices!: Observable<any[]>;
  ngOnInit(): void {
    this.isLoading = true;
    this.exportedInvoices = this.store.pipe(select(exportedInvoicesSelector), map(invoices => {
      return invoices.map(({ templatePreview, items,buyerEmail, company, ...attrs }) => {
        return {
          ...attrs,
          company:company.name,
        }
      } )
    }));
    this.archivedInvoices$ = this.store.pipe(select(shownArchivedInvoicesSelector));
    this.isEmpty$ = this.store.pipe(select(archivedInvoicesEmptySelector));
    this.store.pipe(select(archivedLoadingSelector)).subscribe(loading => this.isLoading = loading);
  }


  onParentCheckboxChange(event: any) {
    this.isParentChecked = event.target.checked;
    if (this.isParentChecked) {
      lastValueFrom(this.archivedInvoices$.pipe(take(1))).then(invoices => {
        this.store.dispatch(ArchivedInvoicesActions.addInvoicesToExported({ exportedInvoices: invoices }));
      })

    }
    else {
      this.store.dispatch(ArchivedInvoicesActions.removeAllInvoicesFromExported());
    }
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
    if (this.headerCells.find(x => x.id === cellId)?.type === TableHeaderCellType.CheckBox) {
      this.selectAll = !this.selectAll;
      if (this.selectAll) {
        lastValueFrom(this.archivedInvoices$.pipe(take(1))).then(invoices => {
          this.store.dispatch(ArchivedInvoicesActions.addInvoicesToExported({ exportedInvoices: invoices }));
        })
      }
      else {
        this.store.dispatch(ArchivedInvoicesActions.removeAllInvoicesFromExported());
      }

    }

  }
  async rowClick(rowEvent: RowEvent) {
    if (this.headerCells.find(x => x.id === rowEvent.cellIndex)?.type == TableHeaderCellType.CheckBox) {
      const isChecked = rowEvent.value;
      const invoice = await lastValueFrom(this.store
        .pipe(select(selectArchivedInvoice(rowEvent.entityId)),
          take(1)));
      if (isChecked) {
        this.store.dispatch(ArchivedInvoicesActions.addToExportedInvoices({ exportedInvoice: invoice! }));
      }
      else {
        this.store.dispatch(ArchivedInvoicesActions.removeFromExportedInvoices({ excludedInvoice: invoice! }));
      }
    }
  }
  onChildCheckboxChange(event: any, invoice: Invoice) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.store.dispatch(ArchivedInvoicesActions.addToExportedInvoices({ exportedInvoice: invoice }));
    }
    else {
      this.store.dispatch(ArchivedInvoicesActions.removeFromExportedInvoices({ excludedInvoice: invoice }));
    }
  }
  openDialog(invoice: Invoice) {
    this.store.dispatch(ArchivedInvoicesActions.openArchivedInvoiceDialog({
      data: {
        invoice,
        isEditingMode: false,
      }
    }))
  }

}
