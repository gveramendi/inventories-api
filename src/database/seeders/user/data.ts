import { UserEntity } from 'src/users/entities/user.entity';

import faker from '@faker-js/faker';
import { Gender } from 'src/users/entities/gender.enum';

export const users: UserEntity[] = [];

for (let id = 1; id <= 1000; id++) {
  const user: UserEntity = new UserEntity();
  user.firstName = faker.name.firstName();
  user.lastName = faker.name.lastName();
  user.email = faker.internet.email();
  user.password = 'password';

  const birthday = faker.date.past();
  birthday.setFullYear(birthday.getFullYear() - Math.floor(Math.random() * 50));
  user.birthday = birthday;

  if (faker.random.boolean) {
    user.gender = Gender.MALE;
  } else {
    user.gender = Gender.FEMALE;
  }

  users.push(user);
}
