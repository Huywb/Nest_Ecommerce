import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { RegisterDto } from './dto/Register.dto';
import { AuthResponseDto } from './dto/Auth-response.dto';

@Injectable()
export class AuthService {
  private readonly SALT = 10;
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly JwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName } = data;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashPass = await bcrypt.hash(password, this.SALT);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashPass,
        firstName,
        lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        password: false,
      },
    });

    const tokens = await this.generateToken(user.id, user.email);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user,
    };
  }

  async generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    const refreshId = randomBytes(15).toString('hex');
    const [accessToken, refreshToken] = await Promise.all([
      this.JwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
      this.JwtService.signAsync(
        { ...payload, refreshId },
        {
          expiresIn: '7d',
          secret: this.configService.get<string>('JWT_SECRET_REFRESH'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashRefreshToken = await bcrypt.hash(refreshToken, this.SALT);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashRefreshToken },
    });
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async login(login: { email: string; password: string }): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: login.email },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const checkPass = await bcrypt.compare(login.password, user.password);
    if (!checkPass) {
      throw new UnauthorizedException();
    }
    const tokens = await this.generateToken(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refreshToken(userId: string): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateToken(userId, user.email);
    await this.updateRefreshToken(userId, tokens.refreshToken);

    return {
      ...tokens,
      user,
    };
  }
}
