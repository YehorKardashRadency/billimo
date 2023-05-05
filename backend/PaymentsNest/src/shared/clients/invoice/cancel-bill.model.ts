import { CancelBillDTO } from 'src/modules/transactions/models/cancel-bill.model';

export interface InvoicingCancellBillDTO extends CancelBillDTO {
  companyId?: number;
}
