import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');
  app.enableCors();

  const documentBuilder = new DocumentBuilder()
    .setTitle('Inventories API')
    .setDescription('The Inventories API documentation.')
    .setVersion('1.0')
    .addTag('inventories')
    .build();
  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
