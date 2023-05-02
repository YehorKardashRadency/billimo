import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../../../core/resources/services/api.service";
import {PaymentStatistic, TabType} from "../models/payment-statistic.models";

@Injectable({
  providedIn: 'root'
})
export class PaymentStatisticService extends ApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  getPaymentStatistics(tabType: TabType) {
    return this.get<PaymentStatistic>("/gateway/bill-payment/payment-statistic", {tabType});
  }
}
