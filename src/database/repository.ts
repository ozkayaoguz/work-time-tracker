import { Knex } from 'knex';

export class Repository {
  constructor(private readonly knex: Knex) {}

  protected get db() {
    return this.knex;
  }
}
