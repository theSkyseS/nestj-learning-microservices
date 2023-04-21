import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Sequelize } from 'sequelize';
import * as cls from 'cls-hooked';

async function bootstrap() {
  const namespace = cls.createNamespace('auth');
  Sequelize.useCLS(namespace);

  const app = await NestFactory.createMicroservice(AppModule, {
    name: 'AUTH_SERVICE',
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}`,
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
