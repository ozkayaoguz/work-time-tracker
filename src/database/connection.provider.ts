import { Provider } from '@nestjs/common';
import knex from 'knex';
import knexConfig from './knexfile';
import { Connection } from './connection';

const knexConnection = knex(knexConfig);

export const ConnectionProvider: Provider<Connection> = {
  provide: Connection,
  useFactory: () => new Connection(knexConnection),
};
