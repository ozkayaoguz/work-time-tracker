import { PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

export abstract class AppEntity<T> {
  constructor(data?: Partial<T>) {
    Object.assign(this, data);
  }

  @PrimaryKey()
  id: string = v4();

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
