import { User } from './user';
import { WorkLog } from './work-log';

declare module 'knex/types/tables' {
  interface Tables {
    user: User;
    work_log: WorkLog;
  }
}
