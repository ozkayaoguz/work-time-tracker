import { Entity } from './entity';

export interface WorkLog extends Entity {
  description: string;
  started_at: Date;
  ended_at?: Date;
  user_id: string;
}
