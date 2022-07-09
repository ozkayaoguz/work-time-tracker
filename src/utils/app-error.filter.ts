import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Response } from 'express';
import { AppError } from './app.error';

export class AppErrorResponse {
  @ApiProperty()
  code: string;

  @ApiProperty()
  message: string;
}

@Catch(AppError)
export class AppErrorFilter implements ExceptionFilter {
  catch(exception: AppError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(422).json({
      code: exception.code,
      message: exception.message,
    } as AppErrorResponse);
  }
}
