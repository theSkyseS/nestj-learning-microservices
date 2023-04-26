import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class MicroserviceExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const error = exception;

    console.log(exception);

    let statusCode: number;
    let message: string;
    if (typeof error === 'string') {
      statusCode = 500;
      message = error;
    } else {
      statusCode = error['status'];
      message = error['message'];
    }

    res.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
