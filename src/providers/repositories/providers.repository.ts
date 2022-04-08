import { EntityRepository, Repository } from 'typeorm';
import { CreateProviderDto } from '../dto/create-provider.dto';
import { ProviderEntity } from '../entities/provider.entity';

@EntityRepository(ProviderEntity)
export class ProvidersRepository extends Repository<ProviderEntity> {
  async createProvider(
    createProviderDto: CreateProviderDto,
  ): Promise<ProviderEntity> {
    const {
      code,
      name,
      email,
      phone,
      address,
      contact,
      emailContact,
      phoneContact,
    } = createProviderDto;

    const user = this.create({
      code,
      name,
      email,
      phone,
      address,
      contact,
      emailContact,
      phoneContact,
    });

    await this.save(user);
    return user;
  }
}
