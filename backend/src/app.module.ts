import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {PassportModule} from '@nestjs/passport'
import {JwtModule} from 'passport-jwt'
import {ConfigModule} from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductController } from './modules/product/product.controller';
import { ProductService } from './modules/product/product.service';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PaymentsModule } from './modules/payments/payments.module';
import { CartModule } from './modules/cart/cart.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'.env'
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10
    }]),
  AuthModule,
  UserModule,
  CategoryModule,
  ProductModule,
  OrderModule,
  PaymentsModule,
  CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
