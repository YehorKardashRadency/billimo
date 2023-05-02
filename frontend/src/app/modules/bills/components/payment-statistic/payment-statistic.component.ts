import {Component} from '@angular/core';
import {Store} from "@ngrx/store";
import { TabType } from '../../resources/models/payment-statistic.models';
import {
  selectCurrentTabProperty,
  selectPaymentStatistic
} from "../../resources/state/payment-statistic/payment-statistic.selectors";

@Component({
  selector: 'app-payment-statistic',
  templateUrl: './payment-statistic.component.html',
  styleUrls: ['./payment-statistic.component.scss'],
})
export class PaymentStatisticComponent {
  paymentStatistic$ = this.store.select(selectPaymentStatistic);
  tabProperty$ = this.store.select(selectCurrentTabProperty);
  green = '#64C68D';
  red = '#ED5252';

  constructor(private store: Store) {
  }

  getColor(tab: TabType): string {
    return tab === TabType.SEND_BILL ? this.green : this.red;
  }
}
