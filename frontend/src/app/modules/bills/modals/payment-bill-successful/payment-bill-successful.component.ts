import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ResponseCreateTransaction} from "../../resources/models/ResponseCreateTransaction";

@Component({
  selector: 'app-payment-bill-successful',
  templateUrl: './payment-bill-successful.component.html',
  styleUrls: ['./payment-bill-successful.component.scss']
})
export class PaymentBillSuccessfulComponent{
  responseCreateTransaction: ResponseCreateTransaction;
  constructor(@Inject(MAT_DIALOG_DATA) private props: ResponseCreateTransaction) {
    this.responseCreateTransaction = props;
    console.log(this.responseCreateTransaction);
  }
}
