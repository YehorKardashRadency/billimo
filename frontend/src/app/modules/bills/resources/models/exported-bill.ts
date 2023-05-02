import { BillStatus } from "./bill-status";

export interface ExportedBill {
  id: number;
  invoiceId: number;
  invoiceNumber: string;
  dueDate:Date;
  createdDate:Date;
  paymentMethod: string;
  PaymentMethodId:number;
  status: BillStatus;
  companyName:string;
  companyId:number;
  amount:number;
  currency:string;
}
