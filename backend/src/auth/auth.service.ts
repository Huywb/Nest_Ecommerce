import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { RegisterDto } from './dto/Register.dto';

@Injectable()
export class AuthService {
  private readonly SALT = 10;
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly JwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const { email, password, firstName, lastName } = data;

    const hashPass = await bcrypt.hash(password, this.SALT);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashPass,
        firstName,
        lastName,
      },
    });

    const tokens = await this.generateToken(newUser.id, newUser.email);

    await this.updateRefreshToken(newUser.id,tokens.refreshToken)

    return {
        tokens,
      newUser,
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
        refreshToken
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashRefreshToken =await bcrypt.hash(refreshToken, this.SALT);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashRefreshToken },
    });
  }

  async logout(userId:string){
    await this.prisma.user.update({where:{id: userId},data:{refreshToken: null}})
  }

  async login(login : {email:string, password:string}){
    const checkUser = await this.prisma.user.findUnique({where:{email: login.email}})
    if(!checkUser){
        throw new UnauthorizedException()
    }
    const checkPass =await bcrypt.compare(login.password,checkUser.password)
    if(!checkPass){
        throw new UnauthorizedException()
    }
    const tokens = await this.generateToken(checkUser.id, checkUser.email)
    await this.updateRefreshToken(checkUser.id, tokens.refreshToken)
    return {
        ...tokens,
        checkUser
    }
  }

  async refreshToken(userId: string){
    const user = await this.prisma.user.findUnique({where:{id: userId}})

    if(!user){
        throw new UnauthorizedException()
    }

    const tokens = await this.generateToken(userId,user.email)
    await this.updateRefreshToken(userId,tokens.refreshToken)

    return {
        ...tokens,
        user
    }
  }
}
