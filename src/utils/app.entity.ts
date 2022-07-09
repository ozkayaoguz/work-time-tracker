import { PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

export abstract class AppEntity<T> {
  constructor(data?: Partial<T>) {
    Object.assign(this, data);
  }

  @ApiProperty()
  @PrimaryKey()
  id: string = v4();

  @ApiProperty()
  @Property()
  createdAt: Date = new Date();

  @ApiProperty()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
