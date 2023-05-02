import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ButtonConfig } from 'src/app/shared/button/button.component';
import { CompanyModel } from 'src/app/shared/models/CompanyModel';
import { AppState } from 'src/app/store';
import * as fromCompanyActions from 'src/app/store/actions/company.actions';
import * as fromCompanySelectors from 'src/app/store/selectors/company.selectors';
import { Invoice } from '../../resources/models/Invoice';


export interface InvoiceDetailsDialogData {
  invoice: Invoice;
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
  declineButton?: ButtonConfig;
  isEditingMode?:boolean,
}

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: InvoiceDetailsDialogData,
    private store: Store<AppState>) { }

  seller$!: Observable<CompanyModel | null>;

  ngOnInit() {
    this.store.dispatch(fromCompanyActions.loadCompany());

    this.seller$ = this.store.select(fromCompanySelectors.selectCompany);
  }
  getTotal() {
    return this.data.invoice.items.reduce((partialSum, i) => partialSum + i.subtotal, 0).toFixed(2);
  }
}
