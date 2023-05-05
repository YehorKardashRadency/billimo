import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Transaction } from './transaction.entity';
import { PostponedPayment } from './postponed-payment.entity';
import { BaseEntity } from 'src/shared/entities/base.entity';

@Entity()
export class PostponedPaymentInfo extends BaseEntity {
  @Column({ type: 'varchar' })
  accessToken: string;

  @Column({ type: 'varchar' })
  accountId: string;

  @Column({ type: 'varchar' })
  ipAddress: string;

  @Column({ type: 'varchar' })
  userAgent: string;

  @OneToOne(() => Transaction)
  @JoinColumn()
  transaction: Transaction;

  @Column()
  transactionId: number;

  @OneToMany(
    () => PostponedPayment,
    (payment) => payment.postponedPaymentInfo,
    { onDelete: 'CASCADE' },
  )
  payments: PostponedPayment[];
}
