import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { registerDto } from './dto/register.dto';
import { error } from 'console';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly SATL = 10;
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
) {}

  async register(registerDto: registerDto) {
    const { email, password, firstName, lastName } = registerDto;

    const extstUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (extstUser) {
      throw new Error('User already exist');
    }

    const hashPass =await bcrypt.hash(password, this.SATL);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashPass,
        firstName,
        lastName,
      },
    });

    const tokens = this.generateToken(newUser.id, newUser.email)

    return {
        ...tokens,
        newUser
    }
  }

  async generateToken(userId: string, email: string){
    const payload = {sub: userId,email}
    const refreshId = randomBytes(15).toString('hex')
    const [accessToken,refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload,{expiresIn: '15m'}),
        this.jwtService.signAsync({...payload,refreshId},{expiresIn: '7d'})
    ])

    return {accessToken, refreshToken}
  }
  
}
