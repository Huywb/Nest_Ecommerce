import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {PassportModule} from '@nestjs/passport'
import {JwtModule} from 'passport-jwt'
import {ConfigModule} from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { ProductModule } from './product/product.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'.env'
    }),
  AuthModule,
  UserModule,
  CategoryModule,
  ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
