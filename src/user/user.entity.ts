import { Entity, Property, Unique } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { AppEntity } from '../app.entity';
import { UserRepository } from './user.repository';

@Entity({ customRepository: () => UserRepository })
export class User extends AppEntity<User> {
  @Property({ nullable: false, length: 50 })
  name: string;

  @Property({ nullable: false, length: 64 })
  @Unique()
  email: string;

  @Property({ nullable: false, length: 64 })
  @Exclude()
  password: string;
}
