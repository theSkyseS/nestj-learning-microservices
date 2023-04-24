import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('RabbitMQ');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rmqContext = context.switchToRpc().getContext<RmqContext>();
    const incomingMessage = rmqContext.getMessage();
    const incomingContent = incomingMessage.content;
    const timestamp = Date.now();

    this.logger.log(`Incoming message: ${incomingContent.toString('utf-8')}`);

    return next.handle().pipe(
      tap((outgoingMessage) => {
        const elapsedTime = Date.now() - timestamp;
        this.logger.log(
          `Outgoing message: ${JSON.stringify(outgoingMessage, null, 2)}`,
        );
        this.logger.log(`Elapsed time: ${elapsedTime}ms`);
      }),
    );
  }
}
