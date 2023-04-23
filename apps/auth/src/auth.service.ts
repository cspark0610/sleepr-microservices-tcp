import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserDocument } from '@app/common';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(user: UserDocument, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get<number>('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);
    // con { httpOnly: true } aseguramos que el token sea accedido solo por una request de tipo http ()
    // sameSite prevenimos que el cookie venga adjuntado desde otro site
    response.cookie('Authentication', token, {
      httpOnly: true,
      sameSite: 'strict',
      expires: expires,
    });
    return token;
  }
}
