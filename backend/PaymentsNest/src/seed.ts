import { NestFactory } from '@nestjs/core';
import { SeederService } from './infra/database/seeders/seeder.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeederService);

  await seedService.seed();
  await app.close();

  console.log('Seed complete.');
}
bootstrap();
