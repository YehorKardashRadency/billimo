import { InvoiceItemModel } from "src/app/modules/invoices/resources/models/InvoiceItemModel";

export interface Invoice {
  id?: number;
  number: string;
  createdDate: Date;
  dueDate?: Date;
  notes: string;
  items: InvoiceItemModel[];
  currency: string;
  total: number;
}
