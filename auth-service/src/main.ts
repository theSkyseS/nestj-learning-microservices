import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_VHOST}`,
      ],
      queue: 'auth',
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();
}
bootstrap();
