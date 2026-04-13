import {
  Injectable,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcryptjs';

import {Request} from 'express'

@Injectable()
export class JwtRefreshToken extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string; email: string }) {
    const token = req.headers.authorization 

    if (!token) throw new UnauthorizedException();

    const refreshToken = token.replace('Bearer', '').trim();

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const checkpass = await bcrypt.compare(
      refreshToken,
      user?.refreshToken || '',
    );

    if (!checkpass) {
      throw new UnauthorizedException();
    }

    return { user };
  }
}
