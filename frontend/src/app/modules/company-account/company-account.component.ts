import { companyAddressesSelector } from './../../store/selectors/company-account.selector';
import {Component, OnInit, TemplateRef} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { fetchAddresses } from 'src/app/store/actions/company-account.actions';
import { map, Observable } from 'rxjs';
import { selectPaymentMethodsCount } from './components/payment-methods/state/payment-methods.selectors';
import * as PaymentMethodsActions from "./components/payment-methods/state/payment-methods.actions";

@Component({
  selector: 'app-company-account',
  templateUrl: './company-account.component.html',
  styleUrls: ['./company-account.component.scss']
})
export class CompanyAccountComponent implements OnInit {
  templateRef?: TemplateRef<any> | undefined
  addressesCount = 0;
  methodsCount$!: Observable<number | null>;

  constructor(private store: Store<AppState>) {
    this.store.pipe(
      select(companyAddressesSelector),
      map(addresses => addresses.length))
      .subscribe(count => this.addressesCount = count);
  }

  ngOnInit(): void {
    this.store.dispatch(fetchAddresses());
    this.store.dispatch(PaymentMethodsActions.loadPaymentMethods());
    this.methodsCount$ = this.store.select(selectPaymentMethodsCount);
  }

  setLowerSection($event: TemplateRef<any> | undefined) {
    this.templateRef = $event;
  }
}
