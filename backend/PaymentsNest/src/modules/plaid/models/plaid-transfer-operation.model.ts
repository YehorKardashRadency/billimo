import { UserPlaidData } from 'src/shared/clients/administration/get-plaid-data.model';
import { Transaction } from '../../transactions/entities/transaction.entity';

export interface PlaidTransferOperationDto {
  description: string;
  amount: number;
  ipAddress: string;
  userAgent: string;
  transaction: Transaction;
  clientInformation: UserPlaidData;
}
