import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'providers' })
export class ProviderEntity extends AbstractEntity {
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
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ nullable: true })
  emailContact: string;

  @Column({ nullable: true })
  phoneContact: string;
}
