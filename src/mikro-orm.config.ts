import './environments';

import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';

const DB_NAME = process.env.DB_NAME || 'db/work-time-tracker';

const config: MikroOrmModuleOptions = {
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: DB_NAME,
  type: 'sqlite',
  // debug: true,
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
};

export default config;
