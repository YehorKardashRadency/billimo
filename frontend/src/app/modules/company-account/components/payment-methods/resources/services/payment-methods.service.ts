import { Injectable } from '@angular/core';
import {PaymentMethodModel} from "../models/payment-method-model";
import {Observable, of} from "rxjs";
import {ApiService} from "../../../../../../core/resources/services/api.service";

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodsService extends ApiService {

  getPaymentMethods$():Observable<PaymentMethodModel[]> {
    const path = "/gateway/payments/methods";
    return this.get<PaymentMethodModel[]>(path);
  }

}
