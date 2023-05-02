import { ArchivedInvoicesActions} from '../../resources/state/actions/archived-invoices.actions';
import { InvoicesActions } from 'src/app/modules/invoices/resources/state/actions/invoices.actions';
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store';

@Component({
  selector: 'app-sort-by',
  templateUrl: './sort-by.component.html',
  styleUrls: ['./sort-by.component.scss']
})
export class SortByComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  @Input() handlerArchivedInvoices = false;
  isSelectListOpen: boolean = false;
  private _value: string = 'All companies';
  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
    this._onChange(this._value);
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

  updateList(el: string) {
    this.isSelectListOpen = false;
    this.value = el;
  }
}
