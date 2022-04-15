import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { ProviderEntity } from 'src/providers/entities/provider.entity';

@Entity({ name: 'products' })
export class ProductEntity extends AbstractEntity {
  @Column({
    unique: true,
    nullable: false,
  })
  code: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  description: string;

  @Column({
    nullable: false,
  })
  color: string;

  @Column({
    nullable: true,
  })
  presentation: string;

  @ManyToOne(() => ProviderEntity, (provider) => provider.products)
  provider: ProviderEntity;
}
