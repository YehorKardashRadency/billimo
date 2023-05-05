import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { TransactionStatus } from './transaction-status.enum';
import { PlaidTransfer } from '../../plaid/entities/plaid-transfer.entity';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Company } from 'src/shared/entities/company.entity';
import { ColumnNumericTransformer } from 'src/shared/numeric-transformer';

@Entity()
export class Transaction extends BaseEntity {
  @Column('int8')
  billId: number;

  @Column({
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_date: Date;

  @Column()
  buyerId: number;

  @ManyToOne(() => Company, (company) => company.buy, { onDelete: 'CASCADE' })
  buyer: Company;

  @Column()
  sellerId: number;

  @ManyToOne(() => Company, (company) => company.sell, { onDelete: 'CASCADE' })
  seller: Company;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.Pending,
  })
  status: TransactionStatus;

  @OneToMany(() => PlaidTransfer, (plaidTransfer) => plaidTransfer.transaction)
  plaidTransfers: PlaidTransfer[];

  constructor(
    billId: number,
    buyerId: number,
    sellerId: number,
    amount: number,
    createdDate?: Date
  ) {
    super();
    this.billId = billId;
    this.buyerId = buyerId;
    this.sellerId = sellerId;
    this.amount = amount;
    if (createdDate) {
      this.created_date = createdDate;
    }
  }
}
