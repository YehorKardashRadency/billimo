import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Transaction } from './transaction.entity';
import { PostponedPayment } from './postponed-payment.entity';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { UserPlaidData } from 'src/shared/clients/administration/get-plaid-data.model';
import { CurrentUser } from 'src/modules/user/user.model';

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
    { onDelete: 'CASCADE', cascade: true }
  )
  payments: PostponedPayment[];

  constructor(
    transaction: Transaction,
    seller: UserPlaidData,
    userInfo: CurrentUser
  ) {
    super();
    this.accessToken = seller?.accessToken || '';
    this.accountId = seller?.accountId || '';
    this.ipAddress = userInfo?.ipAddress || '';
    this.userAgent = userInfo?.userAgent || '';
    this.transaction = transaction;
    this.transactionId = transaction?.id;
  }
}
