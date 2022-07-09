import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DefaultApiResponse } from '../utils/default-api-response.decorator';
import { CreateUserDto } from './dto/create-user.dto';

import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @DefaultApiResponse({ type: User })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
