import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {PassportModule} from '@nestjs/passport'
import {JwtModule} from 'passport-jwt'
import {ConfigModule} from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'.env'
    }),
  AuthModule,
  UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
