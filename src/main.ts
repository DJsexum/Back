import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() 
{
  const app = await NestFactory.create(AppModule);

  app.enableCors('*');

  app.useGlobalPipes
    (new ValidationPipe
      (
        {
          whitelist: true,
          transform: true,
          forbidNonWhitelisted: true,
        }
      )
    );

  await app.listen(process.env.PORT ?? 3000);

  Logger.log('App correiendo en el puerto: ${await app.getUrl()}');
}
bootstrap();