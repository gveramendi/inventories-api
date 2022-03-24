import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { firstName, lastName, email, password } = createUserDto;

    const user = this.create({
      firstName,
      lastName,
      email,
      password,
    });

    await this.save(user);
    return user;
  }
}
