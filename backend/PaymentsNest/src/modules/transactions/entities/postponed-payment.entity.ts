import { Column, Entity, ManyToOne } from 'typeorm';
import { PostponedPaymentType } from './postponed-payment-type.enum';
import { PostponedPaymentInfo } from './postponed-payment-info.entity';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { ColumnNumericTransformer } from 'src/shared/numeric-transformer';
@Entity()
export class PostponedPayment extends BaseEntity {
  @Column({
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @Column('text')
  description: string;

  @Column('date')
  payDate: Date;

  @Column({ type: 'bool', default: false })
  paid: boolean;

  @Column()
  postponedPaymentInfoId: number;

  @ManyToOne(() => PostponedPaymentInfo, (info) => info.payments, {
    onDelete: 'CASCADE',
  })
  postponedPaymentInfo: PostponedPaymentInfo;

  @Column({ type: 'enum', enum: PostponedPaymentType })
  postponedPaymentType: PostponedPaymentType;
}
