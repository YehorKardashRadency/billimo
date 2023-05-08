import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Queues } from './infra/rabbitmq/queues';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  // const queue_url: string = config.getOrThrow('QUEUE_URL');
  // for (const queue of Object.values(Queues)) {
  //   app.connectMicroservice<MicroserviceOptions>({
  //     transport: Transport.RMQ,
  //     options: {
  //       urls: [queue_url],
  //       queue: queue,
  //       queueOptions: {
  //         durable: true,
  //       },
  //     },
  //   });
  // }
  // app.startAllMicroservices();
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    })
  );
  await app.listen(7239);
}
bootstrap();
