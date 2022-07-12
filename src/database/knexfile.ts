import '../environments';
import { Knex } from 'knex';

const DB_NAME = process.env.DB_NAME || 'work_time_tracker';
const DB_USER = process.env.DB_USER || 'admin';
const DB_PASS = process.env.DB_PASS || 'admin';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432');

const config: Knex.Config = {
  client: 'postgresql',
  debug: true,
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};

export default config;
