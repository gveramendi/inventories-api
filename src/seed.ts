import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Seeder } from './database/seeders/seeder';
import { SeedersModule } from './database/seeders/seeders.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  NestFactory.createApplicationContext(SeedersModule)
    .then((appContext) => {
      const logger = appContext.get(Logger);
      const seeder = appContext.get(Seeder);
      seeder
        .seed()
        .then(() => {
          logger.debug('Seeding complete!');
        })
        .catch((error) => {
          logger.error('Seeding failed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch((error) => {
      throw error;
    });
}
bootstrap();
