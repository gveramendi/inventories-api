import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProviderEntity } from '../../providers/entities/provider.entity';

@EntityRepository(ProductEntity)
export class ProductsRepository extends Repository<ProductEntity> {
  async createProduct(
    provider: ProviderEntity,
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    console.log('createProductDto: ', createProductDto);
    const { code, name, description, color, presentation } = createProductDto;

    const product = this.create({
      code,
      name,
      description,
      color,
      presentation,
      provider,
    });

    await this.save(product);
    return product;
  }
}
