import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppErrorFilter } from './utils/app-error.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { WorkLogModule } from './work-log/work-log.module';
import dbConfig from './mikro-orm.config';

@Module({
  imports: [MikroOrmModule.forRoot(dbConfig), UserModule, WorkLogModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AppErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
