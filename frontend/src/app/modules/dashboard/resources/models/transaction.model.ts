import { TransactionStatus } from "./transactionStatus.model";

export interface Transaction{
  id: number,
  icon: string,
  company: string,
  date: string,
  amount: number,
  status:TransactionStatus
}
