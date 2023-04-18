import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class AckInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToRpc().getContext<RmqContext>();
    const channel = ctx.getChannelRef();
    const message = ctx.getMessage();

    return next.handle().pipe(tap(() => channel.ack(message)));
  }
}
