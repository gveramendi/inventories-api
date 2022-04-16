import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDto } from '../dto/user.dto';
import { UsersRepository } from '../repositories/users.repository';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const createdUser = await this.usersRepository.createUser(createUserDto);
      this.logger.log(`User with id: ${createdUser.id} was create.`);

      return await this.getUserById(createdUser.id);
    } catch (err) {
      throw new BadRequestException('Invalid create user.');
    }
  }

  async getUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<UserDto>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    queryBuilder
      .orderBy(`user.${pageOptionsDto.colSort}`, pageOptionsDto.order)
      .skip(pageOptionsDto.page)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      this.logger.error(`User with id: ${id} does not exists.`);
      throw new NotFoundException(`User with id: ${id} not found.`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.getUserById(id);

    const emailFound = await this.usersRepository.findOne({
      email: updateUserDto.email,
    });
    if (emailFound && emailFound.id !== id) {
      throw new NotFoundException(
        `User with email: ${updateUserDto.email} already exits.`,
      );
    }

    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.email = updateUserDto.email;

    try {
      const updatedUser = await this.usersRepository.save(user);
      this.logger.log(`User with id: ${updatedUser.id} was update.`);

      return await this.getUserById(updatedUser.id);
    } catch (err) {
      throw new BadRequestException('Invalid update user.');
    }
  }

  async delete(id: number) {
    const user = await this.getUserById(id);

    const result = await this.usersRepository.delete(user.id);
    this.logger.log(`User with id: ${user.id} was delete.`);

    if (result.affected === 0) {
      throw new NotFoundException(`User with id: "${id}" not found.`);
    }
  }
}
