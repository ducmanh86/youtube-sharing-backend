import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from '../../../statuses/statuses.enum';
import { User } from '../../../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async run() {
    const countUser = await this.repository.count();

    if (!countUser) {
      await this.repository.save(
        this.repository.create({
          firstName: 'Admin',
          lastName: 'Youtube',
          email: 'ducmanh86@gmail.com',
          password: '123456@',
          status: {
            id: StatusEnum.active,
            name: 'Active',
          },
        }),
      );
    }
  }
}
