import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshToken } from './strageties/refresh.stategy';
@Module({
  imports: [
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService : ConfigService)=>({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {expiresIn: '15m'}
      })
    })
  ],
  controllers: [AuthController,JwtRefreshToken],
  providers: [AuthService]
})
export class AuthModule {}
