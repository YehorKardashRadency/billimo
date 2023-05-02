import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { InvoicesActions } from 'src/app/modules/invoices/resources/state/actions/invoices.actions';
import { AppState } from 'src/app/store';
import { ArchivedInvoicesActions } from '../../resources/state/actions/archived-invoices.actions';
import * as fromArchivedInvoicesSelectors from '../../resources/state/selectors/archived-invoices.selectors';
import * as fromCurrentInvoicesSelectors from '../../resources/state/selectors/invoices.selectors';
import { CompanyModel } from './../../../../shared/models/CompanyModel';
@Component({
  selector: 'app-all-companies-dropdown',
  templateUrl: './all-companies-dropdown.component.html',
  styleUrls: ['./all-companies-dropdown.component.scss']
})
export class AllCompaniesDropdownComponent implements OnInit {
  isSelectListOpen: boolean = false;
  private _value: string = 'All companies';
  currentFilter$!: Observable<number | string | undefined>;
  currentInvoicesByCompany$!: Observable<Map<string | CompanyModel, number>>;
  allCompaniesCount$!: Observable<number>;
  @Input() handleArchivedInvoices = false;
  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
    this._onChange(this._value);
  }

  constructor(private store: Store<AppState>) {

  }

  ngOnInit() {
    this.currentInvoicesByCompany$ = this.handleArchivedInvoices
      ? this.store.pipe(select(fromArchivedInvoicesSelectors.archivedInvoicesByCompanySelector))
      : this.store.pipe(select(fromCurrentInvoicesSelectors.currentInvoicesByCompanySelector));
    this.allCompaniesCount$ = this.currentInvoicesByCompany$
      .pipe(map(invoices => [...invoices.values()].reduce((prev, cur) => prev + cur)))

    this.currentFilter$ = this.handleArchivedInvoices
      ? this.store.pipe(select(fromArchivedInvoicesSelectors.companyFilterSelector))
      : this.store.pipe(select(fromCurrentInvoicesSelectors.companyFilterSelector))
    combineLatest([this.currentInvoicesByCompany$, this.currentFilter$]).subscribe(([companies, filter]) => {
      if (filter == undefined) this.value = 'All companies';
      else {
        for (const key of companies.keys()) {
          if (typeof filter == 'string' && typeof key == 'string' && filter == key) {
            this.value = key;
            return
          }
          else if (typeof filter == 'number' && typeof key == 'object' && (key as CompanyModel).id == filter) {
            this.value = key.name;
            return;
          }
        }
      }
    })
  }


  writeValue(value: any): void {
    this.value = value;
  }

  private _onChange(_: any) { }
  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(): void { }

  openSelectList() {
    this.isSelectListOpen = !this.isSelectListOpen;
  }

  closeSelectList() {
    this.isSelectListOpen = false;
  }

  updateList(el: string | CompanyModel | undefined) {
    this.isSelectListOpen = false;
    const prevValue = this.value;

    let filter: string | number | undefined = undefined;
    if (typeof el === 'string') {
      this.value = el as string;
      filter = el as string;
    }
    else if (el != undefined) {
      this.value = (el as CompanyModel).name;
      filter = (el as CompanyModel).id;
    }
    if (prevValue == this.value) {
      this.value = 'All companies';
      filter = undefined;
    }
    if (this.handleArchivedInvoices)
      this.store.dispatch(ArchivedInvoicesActions.setCompanyFilter({ filter }));
    else
      this.store.dispatch(InvoicesActions.setCompanyFilter({ filter }));
  }

  hasLogo(item: string | CompanyModel) {
    if (typeof item === 'string') {
      return false;
    }

    return (item as CompanyModel).logo !== null;
  }

  getLogo(item: string | CompanyModel) {
    return (item as CompanyModel).logo;
  }

  getName(item: string | CompanyModel) {
    if (typeof item === 'string') {
      return item;
    }

    return item.name;
  }

  keyEqual(item: string | CompanyModel) {
    if (typeof item == 'string') {
      return (item as string) === this.value;
    }

    return (item as CompanyModel).name === this.value;
  }


}
