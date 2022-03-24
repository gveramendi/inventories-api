import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Column, Entity } from 'typeorm';
import { Gender } from './gender.enum';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  @Column({
    nullable: false,
  })
  firstName: string;

  @Column({
    nullable: false,
  })
  lastName: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: false,
  })
  birthday: Date;

  @Column({
    nullable: false,
  })
  gender: Gender;
}
