import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [User] })],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
