import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CurrentUser, UserDocument } from '@app/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * @Res({ passthrough: true })
 * Determines whether the response will be sent manually within the route handler,
 * with the use of native response handling methods exposed by the platform-specific response object,
 * or if it should passthrough Nest response processing pipeline.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @MessagePattern('authenticate')
  @UseGuards(JwtAuthGuard)
  async authenticate(@Payload() payload): Promise<UserDocument> {
    console.log('PAYLOAD', payload);
    return payload.user;
  }
}
