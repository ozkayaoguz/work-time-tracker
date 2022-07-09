import { Entity, Property, Unique } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AppEntity } from '../utils/app.entity';
import { UserRepository } from './user.repository';

@Entity({ customRepository: () => UserRepository })
export class User extends AppEntity<User> {
  @ApiProperty()
  @Property({ nullable: false, length: 50 })
  name: string;

  @ApiProperty()
  @Property({ nullable: false, length: 64 })
  @Unique()
  email: string;

  @Property({ nullable: false, length: 64 })
  @Exclude()
  password: string;
}
