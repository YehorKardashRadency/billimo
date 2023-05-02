import { CompanyDetails } from "./company.model";
import {BillCancellationModel} from "./bill-cancellation.model";

export interface Bill {
  id?: number;
  status: string;
  approvalStatus: string;
  paymentMethodId?: number;
  invoice: any;
  buyer: CompanyDetails;
  seller: CompanyDetails;
}
