import { Knex } from 'knex';

export type DbAction<T> = (tx: Connection) => Promise<T>;

export class Connection {
  constructor(private readonly knex: Knex) {}

  getRepository<R>(cls: new (knex: Knex) => R) {
    return new cls(this.knex);
  }

  async transaction<T>(action: DbAction<T>) {
    return await this.knex.transaction(async (tx) => {
      return await action(new Connection(tx));
    });
  }
}
