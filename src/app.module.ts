import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppErrorFilter } from './utils/app-error.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import dbConfig from './mikro-orm.config';

@Module({
  imports: [MikroOrmModule.forRoot(dbConfig), UserModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AppErrorFilter,
    },
  ],
})
export class AppModule {}
