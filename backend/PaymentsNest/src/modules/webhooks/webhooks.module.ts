import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaidTransfersEventSync } from './entities/plaid-transfers-event-sync.entity';
import { PlaidModule } from '../plaid/plaid.module';
import { PlaidTransfer } from '../plaid/entities/plaid-transfer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlaidTransfersEventSync, PlaidTransfer]),
    PlaidModule,
  ],
  providers: [WebhooksService],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
