import { CurrentUser } from 'src/modules/user/user.model';
import { Transaction } from '../entities/transaction.entity';
import { timeAgo } from 'src/shared/date.utils';

export class TransactionModel {
  id: number;
  icon = '/assets/images/icons/figma.png';
  company: string;
  date: string;
  amount: number;
  status: number;

  constructor(user: CurrentUser, transaction: Transaction) {
    this.id = transaction.id;
    const isBuyer = user.companyId === transaction.buyerId;
    this.company = isBuyer ? transaction.seller.name : transaction.buyer.name;
    this.amount = isBuyer ? -transaction.amount : transaction.amount;
    this.date = timeAgo(transaction.created_date);
  }
}
