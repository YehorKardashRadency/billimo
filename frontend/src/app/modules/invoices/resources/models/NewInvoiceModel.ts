import { Currency } from "./InvoiceEnums";
import { InvoiceItemModel } from "./InvoiceItemModel";


export interface NewInvoiceModel{
  id?:number,
  number: number,
  createdDate: Date,
  dueDate: Date,
  notes: string,
  isTemplate: boolean,
  send: boolean,
  buyerId?: number,
  buyerName?:string,
  buyerEmail:string,
  sellerId: number,
  currency: string,
  items: InvoiceItemModel[],
  templatePreview?: string;
  isRegular?:boolean,
  regularCreatingDate?:Date,
}
