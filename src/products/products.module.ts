import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './controllers/products.controller';
import { ProductsRepository } from './repositories/products.repository';
import { ProductsService } from './services/products.service';
import { ProvidersService } from '../providers/services/providers.service';
import { ProvidersRepository } from '../providers/repositories/providers.repository';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProvidersService],
  imports: [
    TypeOrmModule.forFeature([ProductsRepository, ProvidersRepository]),
  ],
})
export class ProductsModule {}
