import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvidersController } from './controllers/providers.controller';
import { ProvidersRepository } from './repositories/providers.repository';
import { ProvidersService } from './services/providers.service';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService],
  imports: [TypeOrmModule.forFeature([ProvidersRepository])],
})
export class ProvidersModule {}
