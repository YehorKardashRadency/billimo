import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {loadPaymentMethods} from "../state/payment-methods.actions";

@Component({
  selector: 'app-payment-method-success-modal',
  templateUrl: './payment-method-success-modal.component.html',
  styleUrls: ['./payment-method-success-modal.component.scss']
})
export class PaymentMethodSuccessModalComponent implements OnInit {

  constructor(private store$: Store) { }

  ngOnInit(): void {
  }

  onSuccess() {
  }
}
