import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '../auth/auth.guard';

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
    const user = await lastValueFrom(
      this.authService.send('auth.register', register),
    );
    const profile = await lastValueFrom(
      this.profileService.send('profiles.create', {
        userId: user.user.id,
        register,
      }),
    );

    return { profile, user };
  }

  @UseGuards(AuthGuard)
  @Post('/refresh')
  refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.send('auth.refresh', refreshToken);
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  logout(@Body('refresh_token') refreshToken: string) {
    return this.authService.send('auth.logout', refreshToken);
  }
}
