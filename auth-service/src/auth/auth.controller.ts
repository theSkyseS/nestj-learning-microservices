import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern('auth.login')
  login(@Payload() userDto: LoginDto) {
    return this.authService.login(userDto);
  }

  @MessagePattern('auth.register')
  register(@Payload() userDto: LoginDto) {
    return this.authService.register(userDto);
  }

  @MessagePattern('auth.refresh')
  refresh(@Payload() refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @MessagePattern('auth.logout')
  logout(@Payload() refreshToken: string) {
    return this.authService.logout(refreshToken);
  }

  @MessagePattern('auth.validate')
  validate(@Payload() token: string) {
    return this.authService.validateAccessToken(token);
  }
}
