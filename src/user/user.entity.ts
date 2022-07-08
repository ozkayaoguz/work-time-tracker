import { Entity, Property, Unique } from '@mikro-orm/core';
import { AppEntity } from '../app.entity';
import { UserRepository } from './user.repository';

@Entity({ customRepository: () => UserRepository })
export class User extends AppEntity {
  @Property({ nullable: false })
  name: string;

  @Property({ nullable: false })
  @Unique()
  email: string;

  @Property({ nullable: false })
  password: string;
}
