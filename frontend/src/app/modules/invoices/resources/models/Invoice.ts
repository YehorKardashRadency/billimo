import { ApprovalStatus } from "src/app/shared/models/ApprovalStatus";
import { CompanyModel } from "src/app/shared/models/CompanyModel";
import { InvoiceItemModel } from "./InvoiceItemModel";

export interface Invoice {
  id?: number,
  number: number,
  dueDate: Date,
  total: number,
  notes: string,
  category: string,
  createdDate: Date,
  company: CompanyModel,
  items: InvoiceItemModel[],
  currency: string,
  paymentStatus: string,
  type: InvoiceType,
  approvalStatus: ApprovalStatus,
  buyerEmail?: string,
  templatePreview?: string;
  regularInvoiceDate?:Date,
  isRegular:boolean,
}

export enum InvoiceType {
  Current,
  Template,
  Archived,
}
