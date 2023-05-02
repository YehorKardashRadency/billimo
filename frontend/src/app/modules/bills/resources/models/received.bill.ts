import { BillStatus } from "./bill-status";
import {BillCancellationModel} from "./bill-cancellation.model";

export interface ReceivedBill {
  id: number;
  invoiceId: number;
  invoiceNumber: string;
  dueDate:Date;
  createdDate:Date;
  paymentMethod: string;
  PaymentMethodId:number;
  status: BillStatus;
  companyName:string;
  companyLogo:string;
  companyId:number;
  amount:number;
  currency:string;
  approvalStatus: string;
  billCancellation: BillCancellationModel;
}
