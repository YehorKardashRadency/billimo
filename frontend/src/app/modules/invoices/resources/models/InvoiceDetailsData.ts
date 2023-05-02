import { CompanyModel } from "src/app/shared/models/CompanyModel";
import { Invoice } from './Invoice';

export interface InvoiceDetailsData {
  invoice: Invoice,
  isEditingMode?:boolean,
}
