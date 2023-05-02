import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryParams } from 'src/app/core/resources/models/QueryParams';
import { ApiService } from 'src/app/core/resources/services/api.service';
import { PaginatedList } from 'src/app/shared/models/PaginatedList';
import { Bill } from '../models/bill.model';
import {PayBill} from "../models/PayBill";
import * as BillList from '../models/bill';
import {ReceivedBill} from '../models/received.bill';
import { ExportedBill } from '../models/exported-bill';
import {CancelBillModel} from "../models/cancel-bill.model";

@Injectable({
  providedIn: 'root'
})
export class BillService extends ApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  getBillPaymentDetails(billId: number): Observable<Bill> {
    return this.get<Bill>(`/gateway/bills/${billId}`);
  }

  payBillNow(payBillDto:PayBill) {
  return this.post('/gateway/bills/paynow', payBillDto);
  }

  payBillOnDate(payBillDto:PayBill) {
    return this.post('/gateway/bills/payondate', payBillDto);
  }

  getSentBills(params: QueryParams): Observable<PaginatedList<BillList.Bill>> {
    const path = '/gateway/bill/sentbills';
    var queryParams = this.getHttpParams(params);
    return this.http.get<PaginatedList<BillList.Bill>>(`${this.baseUrl}${path}`, { params: queryParams });
  }

  getReceivedBills(params: QueryParams): Observable<PaginatedList<ReceivedBill>> {
    const path = '/gateway/bill/receivedbills';
    var queryParams = this.getHttpParams(params);
    return this.http.get<PaginatedList<ReceivedBill>>(`${this.baseUrl}${path}`, { params: queryParams });
  }

  getRequestsBills(params: QueryParams): Observable<PaginatedList<BillList.Bill>> {
    const path = '/gateway/bills/requests';
    var queryParams = this.getHttpParams(params);
    return this.http.get<PaginatedList<BillList.Bill>>(`${this.baseUrl}${path}`, { params: queryParams });
  }

  createBillRequest(billId: number): Observable<any> {
    const path = '/gateway/bills/create/request';
    return this.http.put<any>(`${this.baseUrl}${path}`, billId);
  }

  approvePendingBill(id: number): Observable<any> {
    return this.put<any>(`/gateway/bills/approve/${id}`, null);
  }

  declinePendingBill(id: number): Observable<any> {
    return this.put<any>(`/gateway/bills/decline/${id}`, null);
  }

  getHttpParams(params: QueryParams, withOutPagination:boolean = false): HttpParams {
    var queryParams = new HttpParams()

    if (!withOutPagination){
      queryParams = queryParams
      .append('pageIndex', params.pageIndex)
      .append('pageSize', params.pageSize)
    };

    if (!!params.search) {
      queryParams = queryParams.append('search', params.search);
    }

    params.sort.forEach(sort => {
      queryParams = queryParams
        .append('sort', sort.field + ' ' + sort.direction)
    })

    params.filter.forEach(filter => {
      queryParams = queryParams.append('filter', filter.key + ' ' + filter.filterType + ' ' + filter.value);
    });

    // if (params.filter.length === 0) queryParams = queryParams.append('filter', '');

    return queryParams;
  }

  getExportedBills(params: QueryParams): Observable<Array<ExportedBill>> {
    const path = '/gateway/bill/exportbills';
    var queryParams = this.getHttpParams(params,true);
    return this.http.get<Array<ExportedBill>>(`${this.baseUrl}${path}`, { params: queryParams });
  }

  cancelBill$(model: CancelBillModel): Observable<any> {
    const path = '/gateway/bills/cancel';
    return this.post(path, model);
  }
}
