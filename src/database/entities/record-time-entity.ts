import { Entity } from './entity';

export interface RecordTimeEntity extends Entity {
  created_at: Date;
  updated_at: Date;
}
