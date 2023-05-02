import {Component, OnInit} from '@angular/core';
import {PaymentMethodModel} from "./resources/models/payment-method-model";
import {ButtonConfig} from "../../../../shared/button/button.component";
import * as CompanyAccountReducer from "../../state/company-account.reducer";
import * as PaymentMethodsActions from "./state/payment-methods.actions";
import * as PaymentMethodsSelector from "./state/payment-methods.selectors";
import {Store} from "@ngrx/store";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {
  selected = -1;
  methods$?: Observable<PaymentMethodModel[] | null>;

  config: ButtonConfig = {
    text: "+ Add a payment method",
    onClick: undefined,
  }

  constructor(private store$: Store<CompanyAccountReducer.State>) { }

  ngOnInit(): void {
    this.methods$ = this.store$.select(PaymentMethodsSelector.selectPaymentMethods)
  }

  select(index: number): void{
    this.selected = index;
  }

  plaidConnect():void {
    this.store$.dispatch(PaymentMethodsActions.createLinkToken());
  }
}
