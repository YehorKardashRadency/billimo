import { RmqOptions, Transport } from '@nestjs/microservices';

export enum Queues {
  UpdatePaymentStatistic = 'update-payment-statistic-queue',
  CreatePaymentStatistic = 'create-payment-statistic-queue',
}

export function getQueueOptions(url: string, queue: Queues): RmqOptions {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue: queue,
      queueOptions: {
        durable: true,
      },
    },
  };
}
