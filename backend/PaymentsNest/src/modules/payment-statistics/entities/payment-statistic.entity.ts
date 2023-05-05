import { Column, Entity, ManyToOne } from 'typeorm';
import { TabType } from './tab-type.enum';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Company } from 'src/shared/entities/company.entity';
import { ColumnNumericTransformer } from 'src/shared/numeric-transformer';

@Entity()
export class PaymentStatistic extends BaseEntity {
  @Column()
  companyId: number;

  @ManyToOne(() => Company, (company) => company.paymentStatistics, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @Column({
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
  })
  paid: number;

  @Column({
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
  })
  forPayment: number;

  @Column({
    type: 'enum',
    enum: TabType,
    default: TabType.Empty,
  })
  tabType: TabType;

  constructor(
    companyId: number,
    tabType: TabType,
    paid: number,
    forPayment: number
  ) {
    super();
    this.companyId = companyId;
    this.tabType = tabType;
    this.paid = paid;
    this.forPayment = forPayment;
  }
}
