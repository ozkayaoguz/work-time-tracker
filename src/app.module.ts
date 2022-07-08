import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppErrorFilter } from './app-error.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ['dist/**/*.entity.js'],
      entitiesTs: ['src/**/*.entity.ts'],
      dbName: 'work-time-tracker',
      type: 'sqlite',
    }),
    UserModule,
  ],
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
