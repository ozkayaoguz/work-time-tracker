import { RecordTimeEntity } from './record-time-entity';

export interface User extends RecordTimeEntity {
  name: string;
  email: string;
  password: string;
}
