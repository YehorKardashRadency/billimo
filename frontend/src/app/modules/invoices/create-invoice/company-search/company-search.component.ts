import { InvoicesActions } from 'src/app/modules/invoices/resources/state/actions/invoices.actions';
import { Component, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import { CompanyModel } from 'src/app/shared/models/CompanyModel';
import { AppState } from 'src/app/store';
import * as fromCompanyActions from 'src/app/store/actions/company.actions';
import * as CompanySelector from 'src/app/store/selectors/company.selectors';

@Component({
  selector: 'app-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CompanySearchComponent),
    multi: true
   }]
})
export class CompanySearchComponent implements OnInit, ControlValueAccessor {
  @Input() selectedBuyerName:string| undefined = undefined;
  isSelectListOpen: boolean = false;
  isSelected: boolean = false;
  searchString: string = "";

  private _value!: CompanyModel;
  get value() {
   return this._value;
  }
  set value(val) {
    this._value = val;
    this._onChange(this._value);
  }

  companies$!: Observable<CompanyModel[]|null>;

  constructor(private store: Store<AppState>) { }
  ngOnInit() {
    this.companies$ = this.store.pipe(
      select(CompanySelector.selectAllCompanies),
    );

    this.store.dispatch(fromCompanyActions.loadCompanies({searchString: ""}));
    if(!this.selectedBuyerName){
      return;
    }

    this.findCompanyName();
  }

  findCompanyName() {
    this.companies$.subscribe(companies => {
      if (companies == null) return;
      const company = companies!.filter(x => x.name === this.selectedBuyerName)[0];
      this.value = company;
      this.isSelected = true;
      this.store.dispatch(InvoicesActions.buyerCompanySelectionChanged({selectedCompany:this.value}));
    });
  }

  private _onChange(_: any) { }
  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched() {}

  writeValue(value: CompanyModel): void {
    this.value = value;
  }

  openSelectList() {
    this.isSelectListOpen = !this.isSelectListOpen;
    this.isSelected = false;
  }

  closeSelectList() {
    this.isSelectListOpen = false;
  }

  updateList(el: CompanyModel){
    this.isSelected = true;
    this.isSelectListOpen = false;
    this.value = el;
    this.store.dispatch(InvoicesActions.buyerCompanySelectionChanged({selectedCompany:this.value}));
  }

  newSearch(input: string): void {
    this.searchString = input;

    this.store.dispatch(fromCompanyActions.loadCompanies({searchString: input}));
  }
}
