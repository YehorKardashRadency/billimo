import { InvoiceDTO } from './invoice.model';

export interface BillPaymentDTO {
  id: number;
  status: string;
  paymentMethodId: number;
  invoice: InvoiceDTO;
}
