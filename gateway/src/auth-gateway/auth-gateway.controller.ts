import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
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
    const user = await lastValueFrom(
      this.authService.send('auth.validate', loginDto),
    );
    const token = await lastValueFrom(
      this.authService.send('auth.login', user),
    );
    return token;
  }

  @Post('/register')
  async register(@Body() register: RegisterDto) {
    const user = await lastValueFrom(
      this.authService.send('auth.register', register),
    );
    const profile = await lastValueFrom(
      this.profileService.send('profile.create', { user, register }),
    );

    return { profile, user };
  }

  @Post('/refresh')
  refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.send('auth.refresh', refreshToken);
  }
}
