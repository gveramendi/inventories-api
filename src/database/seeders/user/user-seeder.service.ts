import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { users } from './data';

@Injectable()
export class UserSeederService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create(): Array<Promise<UserEntity>> {
    return users.map(async (user: UserEntity) => {
      return await this.userRepository
        .findOne({ email: user.email })
        .then(async (dbUser) => {
          if (dbUser) {
            return Promise.resolve(null);
          }

          const createdUser: UserEntity = await this.userRepository.save(user);
          return Promise.resolve(createdUser);
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
