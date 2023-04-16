import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthGatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PROFILE_SERVICE') private readonly profileService: ClientProxy,
  ) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const token = await lastValueFrom(
      this.authService.send('auth.login', loginDto),
    );
    return token;
  }

  @Post('/register')
  async register(@Body() register: RegisterDto) {
    const registerResults = await Promise.all([
      lastValueFrom(this.authService.send('auth.register', register)),
      lastValueFrom(this.profileService.send('profile.create', register)),
    ]);

    const [profile, user] = registerResults;
    return { profile, user };
  }

  @Post('/refresh')
  refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.send('auth.refresh', refreshToken);
  }

  @Post('/logout')
  logout(@Body('refresh_token') refreshToken: string) {
    return this.authService.send('auth.logout', refreshToken);
  }
}
