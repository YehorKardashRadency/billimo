import { ApprovalStatus } from 'src/app/shared/models/ApprovalStatus';
export interface CreateInvoiceResult{
  id: number;
  approvalStatus: ApprovalStatus
  number: string;
}
