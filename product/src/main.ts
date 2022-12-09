import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log(process.env.PRODUCT_SERVICE_PORT, 'port');
  const port = process.env.PRODUCT_SERVICE_PORT;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: { host: process.env.PRODUCT_SERVICE_HOST, port: Number(port) },
  });
  app.listen();
}
bootstrap();
