import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import passport from 'passport'
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  // app.use(
  //   session({
  //     resave: false,
  //     saveUninitialized: false,
  //     secret: process.env.COOKIE_SECRET,
  //     cookie: {
  //       httpOnly: true,
  //     }
  //   })
  // )
  // app.use(passport.initialize())
  // app.use(passport.session())
  await app.listen(4000);
}

bootstrap();





