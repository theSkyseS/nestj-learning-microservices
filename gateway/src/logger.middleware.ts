import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: () => void) {
    const { method, originalUrl } = req;
    const params = JSON.stringify(req.params);
    const timestamp = Date.now();
    res.on('finish', () => {
      const { statusCode } = res;
      const elapsedTime = Date.now() - timestamp;
      this.logger.log(
        `${method} ${originalUrl} ${params} ${statusCode} ${elapsedTime}ms`,
      );
    });
    next();
  }
}
