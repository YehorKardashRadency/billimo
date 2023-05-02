import { Subscription } from 'rxjs';
import { InvoiceFormData } from './../resources/models/InvoiceFormData';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import html2canvas from 'html2canvas';
import { combineLatest, firstValueFrom, map, Observable, startWith, tap } from 'rxjs';
import { Currency, Metrics } from 'src/app/modules/invoices/resources/models/InvoiceEnums';
import * as fromCreateInvoiceActions from 'src/app/modules/invoices/resources/state/actions/invoice.actions';
import { ButtonConfig } from 'src/app/shared/button/button.component';
import { CompanyModel } from 'src/app/shared/models/CompanyModel';
import { AppState } from 'src/app/store';
import * as fromCompanyActions from 'src/app/store/actions/company.actions';
import * as fromCompanySelectors from 'src/app/store/selectors/company.selectors';
import { InvoiceItemModel } from '../resources/models/InvoiceItemModel';
import { NewInvoiceModel } from '../resources/models/NewInvoiceModel';
import {
  invoiceFormDataSelector,
  selectedBuyerCompanySelector,
  selectInvoiceNumber
} from './../resources/state/selectors/invoices.selectors';
import { getInvoiceNumber } from 'src/app/modules/invoices/resources/state/actions/invoice.actions';


@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit, OnDestroy {
  addItemButtonConfig: ButtonConfig = { text: '+ Add Item', onClick: () => this.addItem(), disabled: false }
  regularConfig: ButtonConfig = { text: 'Choose date', onClick: () => alert("Click"), disabled: false }
  saveConfig: ButtonConfig = { text: 'Save', onClick: () => this.createOrEditInvoice(), disabled: false }

  Metrics = Metrics;
  Currency = Currency;

  createInvoiceForm!: FormGroup;
  isTemplate!: FormControl;
  taxControl!: FormControl;
  invoiceNumberControl: FormControl | null = null;
  buyer: FormControl | null = null;
  dateControl: FormControl | null = null;
  dueDateControl!: FormControl;
  notesControl!: FormControl;
  currency!: FormControl;
  companyDetailsEmailSwitch!: FormControl;
  companyEmail!: FormControl;
  regularInvoiceDate!:FormControl;
  total: number = 0;

  invoiceItems: FormArray | null = null;

  seller$!: Observable<CompanyModel | null>;
  lastInvoiceNumber$?: Subscription;
  selectedCompany$!: Observable<CompanyModel | null>;
  @ViewChild('preview', { read: ElementRef }) invoicePreview!: ElementRef;
  invoiceFormData?: InvoiceFormData;
  formattedDate!: string;

  sellerId: number = 0;

  constructor(private fb: FormBuilder,
    private store: Store<AppState>) { }
  ngOnDestroy(): void {
    if (this.lastInvoiceNumber$ != undefined)
      this.lastInvoiceNumber$.unsubscribe();
  }

  selectedCompany: CompanyModel | null = null;
  async ngOnInit() {
    this.invoiceFormData = await firstValueFrom(this.store.select(invoiceFormDataSelector));
    if (this.invoiceFormData?.isEditing !== true) {
      this.store.dispatch(getInvoiceNumber());
      this.lastInvoiceNumber$ = this.store
        .select(selectInvoiceNumber)
        .subscribe(inv => this.invoiceNumberControl!.setValue(inv?.newInvoiceNumber));
    }
    this.createFormControls();
    this.createForm();
    this.store.dispatch(fromCompanyActions.loadCompanies({ searchString: "" }));
    this.store.dispatch(fromCompanyActions.loadCompany());

    this.selectedCompany$ = this.store.select(selectedBuyerCompanySelector);
    this.seller$ = this.store.select(fromCompanySelectors.selectCompany)
      .pipe(
        tap(c => this.sellerId = c?.id as number)
      );


  }

  getInvoiceToEditItems() {
    const arr: FormGroup<any>[] = [];
    this.invoiceFormData?.invoice.items.forEach(item => {
      arr.push(this.addItemFormGroup(item));
    })

    return arr;
  }

  createFormControls() {
    this.taxControl = new FormControl(null, [Validators.min(0.05), Validators.max(99)]);
    this.isTemplate = new FormControl(false);
    this.invoiceNumberControl = new FormControl(this.invoiceFormData?.invoice.number,
      [Validators.required, Validators.pattern('^\\d+$')]);

    this.buyer = new FormControl('', Validators.required);
    this.notesControl = new FormControl(this.invoiceFormData?.invoice.notes ?? '');

    this.formattedDate = new Date().toISOString().substring(0, 10);
    this.dateControl = new FormControl(this.invoiceFormData?.invoice.createdDate === undefined ?
      this.formattedDate : new Date(this.invoiceFormData.invoice.createdDate!).toISOString().substring(0, 10),
       Validators.required);

    this.regularInvoiceDate = new FormControl(this.formattedDate);
    this.dueDateControl = new FormControl(this.invoiceFormData?.invoice.dueDate === undefined ?
      '' : new Date(this.invoiceFormData.invoice.dueDate!).toISOString().substring(0,10), Validators.required);

    this.currency = new FormControl(this.invoiceFormData?.invoice.currency ?? Currency.USD, Validators.required);
    this.invoiceItems = new FormArray([
      ...this.getInvoiceToEditItems(),
      this.addItemFormGroup()
    ])
    this.companyDetailsEmailSwitch = new FormControl(this.invoiceFormData?.invoice.company !== undefined);
    this.companyEmail = new FormControl('', [Validators.email]);
    this.companyDetailsEmailSwitch.valueChanges.subscribe(isOn => {
      let emailValidators = [Validators.email];
      let buyerValidators = [];
      if (isOn) {
        emailValidators.push(Validators.required);
        this.buyer!.setValue('');
      }
      else {
        buyerValidators.push(Validators.required);
        this.companyEmail.setValue('');
      }
      this.companyEmail.setValidators(emailValidators);
      this.companyEmail.updateValueAndValidity();
      this.buyer!.setValidators(buyerValidators);
      this.buyer!.updateValueAndValidity();
    })

  }


  createForm() {
    this.createInvoiceForm = this.fb.group({
      invoiceNumberControl: this.invoiceNumberControl,
      buyer: this.buyer,
      dateControl: this.dateControl,
      dueDateControl: this.dueDateControl,
      notesControl: this.notesControl,
      isTemplate: this.isTemplate,
      currency: this.currency,
      invoiceItems: this.invoiceItems,
    });
  }

  addItemFormGroup(invoiceItem: InvoiceItemModel | undefined = undefined): FormGroup {
    const numberCount: number = 1;
    const group = this.fb.group({
      description: new FormControl(invoiceItem?.description ?? '', Validators.required),
      metric: new FormControl(invoiceItem?.metric ?? Metrics.Quantity, Validators.required),
      count: invoiceItem?.count ?? numberCount,
      price: new FormControl(invoiceItem?.price?.toString() ?? '', [Validators.required, Validators.pattern('^[1-9]\\d*(\\.\\d+)?$')]),
      subtotal: new FormControl(invoiceItem?.subtotal ?? 0),
    });

    const number1$ = group.get('count')!.valueChanges.pipe(startWith(numberCount));
    const number2$ = group.get('price')!.valueChanges;
    combineLatest([number1$, number2$])
      .pipe(
        map(([number1, number2]) => (number1 ?? 0) * (number2 ? parseFloat(number2) || 0 : 0))
      )
      .subscribe(res => group.get('subtotal')!.setValue(res));

    return group;
  }
  removeItemFormGroup(i: number) {
    this.invoiceItems!.removeAt(i);
  }
  addItem(invoiceItem: InvoiceItemModel | undefined = undefined) {
    this.invoiceItems!.push(this.addItemFormGroup(invoiceItem));
  }

  getSubTotal(i: number) {
    return this.invoiceItems!.getRawValue()[i].subtotal.toFixed(2);
  }

  get Total() {
    this.total = 0;
    for (let item of this.invoiceItems!.getRawValue()) {
      this.total += item.subtotal;
    }
    return (this.total * (1 + (this.taxControl.value / 100 ?? 0))).toFixed(2);
  }


  async createOrEditInvoice(send: boolean = false) {
    if (this.createInvoiceForm.invalid) {
      this.createInvoiceForm.markAllAsTouched();
      return;
    }

    const invoiceModel: NewInvoiceModel = await this.getInvoiceModelFromForm(send);

    if (invoiceModel.isTemplate) {
      const dataUrl = await html2canvas(this.invoicePreview.nativeElement).then(canvas => canvas.toDataURL());
      invoiceModel.templatePreview = dataUrl;
    }
    if (this.invoiceFormData == undefined || this.invoiceFormData?.isEditing === false) {
      this.store.dispatch(fromCreateInvoiceActions.createInvoicePage({ invoice: invoiceModel }));
    }
    else {
      this.store.dispatch(fromCreateInvoiceActions.editInvoice({ invoiceToEdit: invoiceModel }));
    }
  }

  private async getInvoiceModelFromForm(send: boolean): Promise<NewInvoiceModel> {
    const selectedCompany = await firstValueFrom(this.selectedCompany$);
    return {
      id: this.invoiceFormData?.invoice.id,
      number: this.invoiceNumberControl!.value,
      createdDate: this.dateControl!.value,
      dueDate: this.dueDateControl.value,
      notes: this.notesControl.value,
      isTemplate: this.isTemplate.value,
      send,
      sellerId: this.sellerId,
      buyerName: this.buyer!.value.name,
      buyerId: selectedCompany?.id,
      buyerEmail: this.companyEmail.value,
      currency: this.currency.value,
      items: this.invoiceItems!.value,
      isRegular:this.isRegular,
      regularCreatingDate:this.regularInvoiceDate.value,
    };
  }

  isRegular:boolean = false;
  onRegularChange(event:any){
    this.isRegular = event.target.checked;
  }
}
