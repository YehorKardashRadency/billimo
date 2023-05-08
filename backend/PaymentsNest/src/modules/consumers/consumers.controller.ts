import {
  RabbitSubscribe,
  defaultNackErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { Exchanges } from 'src/infra/rabbitmq/exchanges';
import { Queues } from 'src/infra/rabbitmq/queues';
import {
  CreatePaymentStatisticMessage,
  UpdatePaymentStatisticMessage,
} from './models';
import { Event } from 'src/infra/rabbitmq/event';
import { ConsumersService } from './consumers.service';

@Controller('consumers')
export class ConsumersController {
  constructor(private readonly consumersService: ConsumersService) {}

  @RabbitSubscribe({
    exchange: Exchanges.UpdatePaymentStatistic,
    routingKey: '',
    queue: Queues.UpdatePaymentStatistic,
    errorHandler: defaultNackErrorHandler,
  })
  @RabbitSubscribe({
    exchange: Exchanges.UpdateBuyerStatistic,
    routingKey: '',
    queue: Queues.UpdatePaymentStatistic,
    errorHandler: defaultNackErrorHandler,
  })
  public async updateStatisticHandler(
    event: Event<UpdatePaymentStatisticMessage>
  ) {
    await this.consumersService.updatePaymentStatistic(event.message);
    return;
  }

  @RabbitSubscribe({
    exchange: Exchanges.CreatePaymentStatistic,
    routingKey: '',
    queue: Queues.CreatePaymentStatistic,
    errorHandler: defaultNackErrorHandler,
  })
  public async createStatisticHandler(
    event: Event<CreatePaymentStatisticMessage>
  ) {
    await this.consumersService.createPaymentStatistic(event.message);
    return;
  }
}
