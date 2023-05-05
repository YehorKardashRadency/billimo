import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class PlaidTransfersEventSync extends BaseEntity {
  @Column('int')
  lastEventId: number;
}
