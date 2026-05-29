import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ProvidersModule } from './providers/providers.module';

@Module
(
  {
    imports: [UsersModule, CategoriesModule, ProductsModule, ProvidersModule],
    controllers: [AppController],
    providers: [AppService],
  }
)
export class AppModule {}
