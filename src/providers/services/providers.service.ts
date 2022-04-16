import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { CreateProviderDto } from '../dto/create-provider.dto';
import { ProviderDto } from '../dto/provider.dto';
import { UpdateProviderDto } from '../dto/update-provider.dto';
import { ProviderEntity } from '../entities/provider.entity';
import { ProvidersRepository } from '../repositories/providers.repository';

@Injectable()
export class ProvidersService {
  private readonly logger = new Logger(ProvidersService.name);

  constructor(private readonly providersRepository: ProvidersRepository) {}

  async create(createProviderDto: CreateProviderDto): Promise<ProviderEntity> {
    try {
      const createdProvider = await this.providersRepository.createProvider(
        createProviderDto,
      );
      this.logger.log(`Provider with id: ${createdProvider.id} was create.`);

      return await this.getProviderById(createdProvider.id);
    } catch (err) {
      throw new BadRequestException('Invalid provider user.');
    }
  }

  async getProviders(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProviderDto>> {
    const queryBuilder =
      this.providersRepository.createQueryBuilder('provider');
    queryBuilder
      .orderBy(`provider.${pageOptionsDto.colSort}`, pageOptionsDto.order)
      .skip(pageOptionsDto.page)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getProviderById(id: number) {
    const provider = await this.providersRepository.findOne(id);
    if (!provider) {
      this.logger.error(`Provider with id: ${id} does not exists.`);
      throw new NotFoundException(`Provider with id: ${id} not found.`);
    }

    return provider;
  }

  async update(id: number, updateProviderDto: UpdateProviderDto) {
    const provider = await this.getProviderById(id);

    const codeFound = await this.providersRepository.findOne({
      code: updateProviderDto.code,
    });
    if (codeFound && codeFound.id !== id) {
      throw new NotFoundException(
        `Provider with code: ${updateProviderDto.code} already exits.`,
      );
    }

    const nameFound = await this.providersRepository.findOne({
      name: updateProviderDto.name,
    });
    if (nameFound && nameFound.id !== id) {
      throw new NotFoundException(
        `Provider with name: ${updateProviderDto.name} already exits.`,
      );
    }

    provider.code = updateProviderDto.code;
    provider.name = updateProviderDto.name;
    provider.email = updateProviderDto.email;
    provider.phone = updateProviderDto.phone;
    provider.address = updateProviderDto.address;
    provider.contact = updateProviderDto.contact;
    provider.emailContact = updateProviderDto.emailContact;
    provider.phoneContact = updateProviderDto.phoneContact;

    try {
      const updatedProvider = await this.providersRepository.save(provider);
      this.logger.log(`Provider with id: ${updatedProvider.id} was update.`);

      return await this.getProviderById(updatedProvider.id);
    } catch (err) {
      throw new BadRequestException('Invalid update provider.');
    }
  }

  async delete(id: number) {
    const provider = await this.getProviderById(id);

    const result = await this.providersRepository.delete(provider.id);
    this.logger.log(`Provider with id: ${provider.id} was delete.`);

    if (result.affected === 0) {
      throw new NotFoundException(`Provider with id: "${id}" not found.`);
    }
  }
}
