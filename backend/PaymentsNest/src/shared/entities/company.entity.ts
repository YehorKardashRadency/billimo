import { PaymentStatistic } from 'src/modules/payment-statistics/entities/payment-statistic.entity';
import { BaseEntity } from './base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';

@Entity()
export class Company extends BaseEntity {
  @Column('text')
  name: string;
  @OneToMany(() => PaymentStatistic, (statistic) => statistic.company)
  paymentStatistics: PaymentStatistic[];

  @OneToMany(() => Transaction, (transaction) => transaction.buyer, {
    cascade: true,
  })
  buy: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.seller, {
    cascade: true,
  })
  sell: Transaction[];

  constructor(name: string, id?: number) {
    super();
    this.name = name;
    if (id !== undefined) {
      this.id = id;
    }
  }
}
