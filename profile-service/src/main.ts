import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Sequelize } from 'sequelize';
import * as cls from 'cls-hooked';

async function bootstrap() {
  const namespace = cls.createNamespace('profiles');
  Sequelize.useCLS(namespace);

  const app = await NestFactory.createMicroservice(AppModule, {
    name: 'PROFILE_SERVICE',
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}`,
      ],
      queue: 'profile',
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();
}
bootstrap();
