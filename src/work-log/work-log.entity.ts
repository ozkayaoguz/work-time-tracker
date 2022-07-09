import { Entity, Formula, ManyToOne, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { AppEntity } from '../utils/app.entity';
import { WorkLogRepository } from './work-log.repository';

@Entity({ customRepository: () => WorkLogRepository })
export class WorkLog extends AppEntity<WorkLog> {
  @ApiProperty()
  @Property({ nullable: false, length: 64 })
  description: string;

  @ApiProperty()
  @Property()
  startedAt: Date = new Date();

  @ApiProperty({ nullable: true })
  @Property({ nullable: true })
  endedAt?: Date;

  @ApiProperty({ nullable: true })
  @Formula((a) => `(cast(${a}.ended_at AS real) - ${a}.started_at) / (1000*60*60)`)
  workedHours: number;

  @ManyToOne(() => User)
  user: User;
}
