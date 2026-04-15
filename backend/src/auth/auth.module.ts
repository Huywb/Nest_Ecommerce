import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { RefreshStrategy } from 'src/strategies/refresh.strategy';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService)=>({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions :{
          expiresIn: '10d'
        }
      })
    })
  ],
  providers: [AuthService,PrismaService,JwtStrategy,RefreshStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
