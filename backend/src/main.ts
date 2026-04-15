import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
      transform: true,
      transformOptions: {
        enableImplicitConversion:true
      }
    })
  )

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") ?? 'http://localhost:3000',
    credential: true,
    method: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','Accept']
  })

  const config = new DocumentBuilder()
    .setTitle("Api Documentation")
    .setDescription('Api documentation for the application')
    .setVersion('1.0')
    .addTag('auth','Authentication related endpoints')
    .addBearerAuth({
      type:'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT Token',
      in: 'header'
    },
    "JWT-auth"
    )
    .addBearerAuth({
      type:'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Refresh-JWT',
      description: 'Enter Refresh JWT Token',
      in: 'header'
    },
    "JWT-refresh")
    .addServer('http://localhost:3001',"Development Server")
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs',app,document,{
    swaggerOptions: {
      persistAuthorization: true,
      tagSorter: 'alpha',
      operationSroter: 'alpha'
    },
    customSiteTitle: 'API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar {display: none}
      .swagger-ui .info {margin: 50px 0}
      .swagger-ui .info .title {color : #4A90E2 }
       `
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error)=>{
  Logger.error("Error server ", error)
  process.exit(1)
});
