import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProductsRepository } from '../repositories/products.repository';
import { ProvidersService } from '../../providers/services/providers.service';
import { ProviderEntity } from '../../providers/entities/provider.entity';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { ProductDto } from '../dtos/product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly providersService: ProvidersService,
  ) {}

  async create(
    providerId: number,
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    try {
      const codeFound = await this.productsRepository.findOne({
        code: createProductDto.code,
      });
      console.log('codeFound: ', codeFound);
      if (codeFound) {
        throw new NotFoundException(
          `Product with code: ${createProductDto.code} already exits.`,
        );
      }

      const nameFound = await this.productsRepository.findOne({
        name: createProductDto.name,
      });
      console.log('nameFound: ', nameFound);
      if (nameFound) {
        throw new NotFoundException(
          `Product with name: ${createProductDto.name} already exits.`,
        );
      }

      console.log('providerId: ', providerId);
      const provider: ProviderEntity =
        await this.providersService.getProviderById(providerId);

      console.log('provider: ', provider);
      const createdProduct = await this.productsRepository.createProduct(
        provider,
        createProductDto,
      );
      this.logger.log(`Product with id: ${createdProduct.id} was create.`);

      return await this.getProductById(createdProduct.id);
    } catch (err) {
      throw new BadRequestException('Invalid product.');
    }
  }

  async getProducts(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProductDto>> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');
    queryBuilder
      .orderBy(`product.${pageOptionsDto.colSort}`, pageOptionsDto.order)
      .skip(pageOptionsDto.page)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getProductsByProviderId(
    providerId: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProductDto>> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');
    const colSort = `product.${pageOptionsDto.colSort}`;

    queryBuilder
      .where('product.providerId = :id', { id: providerId })
      .orderBy(colSort, pageOptionsDto.order)
      .skip(pageOptionsDto.page)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getProductById(id: number) {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      this.logger.error(`Product with id: ${id} does not exists.`);
      throw new NotFoundException(`Product with id: ${id} not found.`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.getProductById(id);

    const codeFound = await this.productsRepository.findOne({
      code: updateProductDto.code,
    });
    if (codeFound && codeFound.id !== id) {
      throw new NotFoundException(
        `Product with code: ${updateProductDto.code} already exits.`,
      );
    }

    const nameFound = await this.productsRepository.findOne({
      name: updateProductDto.name,
    });
    if (nameFound && nameFound.id !== id) {
      throw new NotFoundException(
        `Product with name: ${updateProductDto.name} already exits.`,
      );
    }

    product.code = updateProductDto.code;
    product.name = updateProductDto.name;
    product.description = updateProductDto.description;
    product.color = updateProductDto.color;
    product.presentation = updateProductDto.presentation;

    try {
      const updatedProduct = await this.productsRepository.save(product);
      this.logger.log(`Product with id: ${updatedProduct.id} was update.`);

      return await this.getProductById(updatedProduct.id);
    } catch (err) {
      throw new BadRequestException('Invalid update product.');
    }
  }

  async delete(id: number) {
    const product = await this.getProductById(id);

    const result = await this.productsRepository.delete(product.id);
    this.logger.log(`Product with id: ${product.id} was delete.`);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with id: "${id}" not found.`);
    }
  }
}
