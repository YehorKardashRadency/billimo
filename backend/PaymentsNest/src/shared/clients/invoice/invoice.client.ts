import { Injectable } from '@nestjs/common';
import { ApiService } from '../api.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BillPaymentDTO } from './models/bill-payment.model';
import { MarkBillsDTO } from './models/mark-bills.model';
import { InvoicingCancellBillDTO } from './cancel-bill.model';

@Injectable()
export class InvoiceClient extends ApiService {
  constructor(
    protected readonly http: HttpService,
    private readonly configService: ConfigService
  ) {
    super(http);
    this.baseUrl = configService.getOrThrow('INVOICE_API');
  }
  async getBillById(id: number) {
    const response = await this.get(`/api/Bills/${id}/retrieve`);
    return response.data as BillPaymentDTO;
  }
  async markBillsAs(model: MarkBillsDTO) {
    await this.put(`/api/Bills/markas`, model);
  }
  async cancelBill(cancelBillDTO: InvoicingCancellBillDTO) {
    await this.put('/api/Bills/cancel', cancelBillDTO);
  }
}
