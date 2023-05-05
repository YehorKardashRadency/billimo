import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Put,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhookEvent } from './models/webhook-event.model';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}
  @Post('plaid')
  async updateTransfers(@Body() event: WebhookEvent) {
    if (
      (event.environment === 'sandbox' &&
        event.webhook_code === 'DEFAULT_UPDATE' &&
        event.webhook_type === 'TRANSACTIONS') ||
      (event.environment === 'sandbox' &&
        event.webhook_code === 'TRANSFER_EVENTS_UPDATE' &&
        event.webhook_type === 'TRANSFER')
    ) {
      await this.webhooksService.updateTransfers();
      return;
    }
    throw new BadRequestException();
  }
  @Put('update')
  async updateTransactionStatuses() {
    await this.webhooksService.updateTransactionStatus();
    return;
  }
}
