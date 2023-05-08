import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { minutesAgo, daysAgo } from 'src/shared/date.utils';

export const transactions: Transaction[] = [
  new Transaction(1, 2, 1, 5000, minutesAgo(10)),
  new Transaction(2, 2, 3, 3000, minutesAgo(20)),
  new Transaction(3, 2, 1, 5000, minutesAgo(30)),
  new Transaction(4, 1, 2, 7000, daysAgo(30)),
  new Transaction(5, 1, 2, 7000, daysAgo(40)),
  new Transaction(6, 1, 3, 18000, daysAgo(50)),
  new Transaction(6, 1, 3, 18000, daysAgo(500)),
];
