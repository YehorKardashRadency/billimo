import { Column, Entity, ManyToOne } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { TransferEventType } from 'plaid';
import { BaseEntity } from 'src/shared/entities/base.entity';

@Entity()
export class PlaidTransfer extends BaseEntity {
  @Column('text')
  transferId: string;

  @Column()
  transactionId: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.plaidTransfers, {
    onDelete: 'CASCADE',
  })
  transaction: Transaction;

  @Column('bool')
  buyer: boolean;

  @Column({
    type: 'enum',
    enum: TransferEventType,
  })
  eventType: TransferEventType;

  @Column('bool')
  transactionStatusUpdated: boolean;

  constructor(
    transaction: Transaction,
    eventType: TransferEventType,
    transferId: string,
    buyer: boolean
  ) {
    super();
    this.transaction = transaction;
    this.eventType = eventType;
    this.transferId = transferId;
    this.buyer = buyer;
    this.transactionStatusUpdated = false;
  }
}
