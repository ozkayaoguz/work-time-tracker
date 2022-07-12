import { Connection, DbAction } from './connection';

export class ConnectionMock extends Connection {
  private repo = {};

  getRepo<T>() {
    return this.repo as T;
  }

  constructor() {
    super(null);
  }

  getRepository<R>(cls: new (knex) => R) {
    return this.repo as any;
  }

  async transaction<T>(action: DbAction<T>) {
    return await action(this);
  }
}
