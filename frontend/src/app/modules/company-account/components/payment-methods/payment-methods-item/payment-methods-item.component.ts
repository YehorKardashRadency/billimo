import {Component, Input, OnInit} from '@angular/core';
import {PaymentMethodModel, PaymentMethodType} from "../resources/models/payment-method-model";

@Component({
  selector: 'app-payment-methods-item',
  templateUrl: './payment-methods-item.component.html',
  styleUrls: ['./payment-methods-item.component.scss']
})
export class PaymentMethodsItemComponent implements OnInit {
  @Input() model?: PaymentMethodModel = undefined;

  constructor() { }

  ngOnInit(): void { }

  getIcon(type: PaymentMethodType){
    switch(type) {
      case PaymentMethodType.Bank:
        return 'assets/images/icons/payment_method_bank.svg';
      case PaymentMethodType.Card:
        return 'assets/images/icons/payment_method_card.svg';
      case PaymentMethodType.Paypal:
        return 'assets/images/icons/payment_method_paypal.svg';
      default:
        throw new Error(`Invalid payment method type: ${type}`);
    }
  }
}
