import { ExecutionContext, Injectable } from '@nestjs/common';
import { Payload } from './auth.payload';
import { RolesGuard } from './roles.guard';

@Injectable()
export class ProfileAccessGuard extends RolesGuard {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const id = Number(req.params.id);
    const user = req.user as Payload;
    return super.canActivate(context) && user.id === id;
  }
}
