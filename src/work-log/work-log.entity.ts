import { Entity, ManyToOne, Property } from '@mikro-orm/core';
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

  @ManyToOne(() => User)
  user: User;
}
