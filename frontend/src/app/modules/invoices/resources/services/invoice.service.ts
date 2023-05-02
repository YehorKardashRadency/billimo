import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyModel } from 'src/app/shared/models/CompanyModel';
import { ApiService } from '../../../../core/resources/services/api.service';
import { CreateInvoiceResult } from '../models/CreateInvoiceResult';
import { Invoice } from '../models/Invoice';
import { NewInvoiceModel } from '../models/NewInvoiceModel';
import {GetInvoiceNumber} from "../models/GetInvoiceNumber";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService extends ApiService {
  getRegularInvoices() {
    return this.get<Invoice[]>('/gateway/invoice/regular');
  }
  deleteInvoice(invoiceId: number) {
    return this.delete<any>(`/gateway/invoice/delete/${invoiceId}`);
  }

  constructor(http: HttpClient) {
    super(http);
  }

  createInvoice(invoice: NewInvoiceModel): Observable<CreateInvoiceResult> {
    const path = "/gateway/invoice/create-or-edit";
    return this.post<any>(path, invoice);
  }

  archiveInvoice(id: number): Observable<any> {
    return this.put<any>(`/gateway/invoice/toarchive/${id}`, null);
  }
  acceptPendingInvoice(id: number): Observable<any> {
    return this.put<any>(`/gateway/invoice/accept/${id}`, null);
  }
  declinePendingInvoice(id: number): Observable<any> {
    return this.put<any>(`/gateway/invoice/decline/${id}`, null);
  }
  sendInvoice(id: number): Observable<any> {
    return this.post<any>(`/gateway/invoice/send/${id}`, null);
  }
  getArchivedInvocies() {
    return this.get<Invoice[]>(`/gateway/invoice/archived`);
  }
  getRequestsInvoices() {
    return this.get<Invoice[]>(`/gateway/invoice/requests`);
  }
  getCurrentInvoices() {
    return this.get<Invoice[]>(`/gateway/invoice/current`);
  }
  getTemplates() {
    return this.get<Invoice[]>(`/gateway/invoice/templates`);
  }

  getCompanies$(searchString: string): Observable<CompanyModel[]> {
  const path = "/gateway/company/getcompanies";
  let queryParams = new HttpParams()
    .append("searchString", searchString)
  return this.http.get<CompanyModel[]>(this.baseUrl + path, {params: queryParams});
}

  getInvoiceNumber(){return this.get<GetInvoiceNumber>('/gateway/invoice/invoice-number');}

  editInvoice(invoiceToEdit: NewInvoiceModel) {
    return this.post('/gateway/invoice/create-or-edit', invoiceToEdit);
  }
}
